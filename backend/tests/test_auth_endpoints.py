"""
Tests for authentication API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.auth import get_password_hash
from app.main import app
from app.models.user import User
from app.services.auth import AuthService


class TestAuthEndpoints:
    """Test authentication API endpoints."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    @pytest.fixture
    async def test_user_data(self):
        """Test user data for registration."""
        return {
            "email": "test@example.com",
            "password": "TestPassword123",
            "first_name": "John",
            "last_name": "Doe"
        }

    @pytest.fixture
    def existing_user(self, db_session: Session):
        """Create an existing user for testing."""
        user = User(
            email="existing@example.com",
            password_hash=get_password_hash("ExistingPassword123"),
            is_active=True,
            is_verified=True,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    def test_auth_health_check(self, client):
        """Test authentication health check endpoint."""
        response = client.get("/api/auth/health")

        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Authentication service is healthy"

    def test_register_user_success(self, client, test_user_data):
        """Test successful user registration."""
        response = client.post("/api/auth/register", json=test_user_data)

        if response.status_code != 201:
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.text}")

        assert response.status_code == 201
        data = response.json()

        assert data["message"] == "User registered successfully"
        assert "user" in data

        user = data["user"]
        assert user["email"] == test_user_data["email"]
        assert user["first_name"] == test_user_data["first_name"]
        assert user["last_name"] == test_user_data["last_name"]
        assert user["is_active"] is True
        assert user["is_verified"] is False
        assert "id" in user
        assert "created_at" in user

    def test_register_user_invalid_email(self, client):
        """Test user registration with invalid email."""
        invalid_data = {
            "email": "invalid-email",
            "password": "TestPassword123"
        }

        response = client.post("/api/auth/register", json=invalid_data)

        assert response.status_code == 422  # Validation error

    def test_register_user_weak_password(self, client):
        """Test user registration with weak password."""
        weak_password_data = {
            "email": "test@example.com",
            "password": "weak"
        }

        response = client.post("/api/auth/register", json=weak_password_data)

        assert response.status_code == 422  # Validation error

    def test_register_duplicate_email(self, client, existing_user):
        """Test user registration with duplicate email."""
        duplicate_data = {
            "email": existing_user.email,
            "password": "TestPassword123"
        }

        response = client.post("/api/auth/register", json=duplicate_data)

        assert response.status_code == 400
        data = response.json()
        assert "already registered" in data["detail"].lower()

    def test_login_success(self, client, existing_user):
        """Test successful user login."""
        login_data = {
            "email": existing_user.email,
            "password": "ExistingPassword123"
        }

        response = client.post("/api/auth/login", json=login_data)

        assert response.status_code == 200
        data = response.json()

        assert data["message"] == "Login successful"
        assert "user" in data
        assert "token" in data

        user = data["user"]
        assert user["email"] == existing_user.email
        assert user["id"] == existing_user.id

        token = data["token"]
        assert "access_token" in token
        assert "refresh_token" in token
        assert token["token_type"] == "bearer"
        assert "expires_in" in token

    def test_login_invalid_email(self, client):
        """Test login with non-existent email."""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "SomePassword123"
        }

        response = client.post("/api/auth/login", json=login_data)

        assert response.status_code == 401
        data = response.json()
        assert "invalid email or password" in data["detail"].lower()

    def test_login_wrong_password(self, client, existing_user):
        """Test login with wrong password."""
        login_data = {
            "email": existing_user.email,
            "password": "WrongPassword123"
        }

        response = client.post("/api/auth/login", json=login_data)

        assert response.status_code == 401
        data = response.json()
        assert "invalid email or password" in data["detail"].lower()

    def test_get_current_user_success(self, client, existing_user, db_session: Session):
        """Test getting current user with valid token."""
        # Create auth service and get token
        auth_service = AuthService(db_session)
        tokens = auth_service.create_tokens_for_user(existing_user)

        headers = {"Authorization": f"Bearer {tokens.access_token}"}
        response = client.get("/api/auth/me", headers=headers)

        assert response.status_code == 200
        data = response.json()

        assert data["email"] == existing_user.email
        assert data["id"] == existing_user.id
        assert data["is_active"] is True

    def test_get_current_user_no_token(self, client):
        """Test getting current user without token."""
        response = client.get("/api/auth/me")

        assert response.status_code == 403  # FastAPI security returns 403 for missing auth

    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token."""
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = client.get("/api/auth/me", headers=headers)

        assert response.status_code == 401
        data = response.json()
        assert "invalid or expired token" in data["detail"].lower()

    def test_refresh_token_success(self, client, existing_user, db_session: Session):
        """Test successful token refresh."""
        # Create auth service and get tokens
        auth_service = AuthService(db_session)
        tokens = auth_service.create_tokens_for_user(existing_user)

        refresh_data = {"refresh_token": tokens.refresh_token}
        response = client.post("/api/auth/refresh", json=refresh_data)

        assert response.status_code == 200
        data = response.json()

        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_refresh_token_invalid(self, client):
        """Test token refresh with invalid refresh token."""
        refresh_data = {"refresh_token": "invalid_refresh_token"}
        response = client.post("/api/auth/refresh", json=refresh_data)

        assert response.status_code == 401
        data = response.json()
        assert "invalid or expired refresh token" in data["detail"].lower()

    def test_refresh_token_with_access_token(self, client, existing_user, db_session: Session):
        """Test token refresh using access token (should fail)."""
        # Create auth service and get tokens
        auth_service = AuthService(db_session)
        tokens = auth_service.create_tokens_for_user(existing_user)

        # Try to use access token as refresh token
        refresh_data = {"refresh_token": tokens.access_token}
        response = client.post("/api/auth/refresh", json=refresh_data)

        assert response.status_code == 401
        data = response.json()
        assert "invalid or expired refresh token" in data["detail"].lower()

    def test_logout_success(self, client, existing_user, db_session: Session):
        """Test successful logout."""
        # Create auth service and get token
        auth_service = AuthService(db_session)
        tokens = auth_service.create_tokens_for_user(existing_user)

        headers = {"Authorization": f"Bearer {tokens.access_token}"}
        response = client.post("/api/auth/logout", headers=headers)

        assert response.status_code == 200
        data = response.json()
        assert "logged out successfully" in data["message"].lower()

    def test_logout_no_token(self, client):
        """Test logout without token."""
        response = client.post("/api/auth/logout")

        assert response.status_code == 403  # FastAPI security returns 403 for missing auth

    def test_logout_invalid_token(self, client):
        """Test logout with invalid token."""
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = client.post("/api/auth/logout", headers=headers)

        assert response.status_code == 401
        data = response.json()
        assert "invalid or expired token" in data["detail"].lower()


class TestAuthIntegrationFlow:
    """Test complete authentication flows."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_complete_auth_flow(self, client):
        """Test complete authentication flow: register -> login -> access protected endpoint -> logout."""
        # 1. Register a new user
        register_data = {
            "email": "flowtest@example.com",
            "password": "FlowTestPassword123",
            "first_name": "Flow",
            "last_name": "Test"
        }

        register_response = client.post("/api/auth/register", json=register_data)
        assert register_response.status_code == 201

        # 2. Login with the new user
        login_data = {
            "email": "flowtest@example.com",
            "password": "FlowTestPassword123"
        }

        login_response = client.post("/api/auth/login", json=login_data)
        assert login_response.status_code == 200

        login_result = login_response.json()
        access_token = login_result["token"]["access_token"]
        refresh_token = login_result["token"]["refresh_token"]

        # 3. Access protected endpoint
        headers = {"Authorization": f"Bearer {access_token}"}
        me_response = client.get("/api/auth/me", headers=headers)
        assert me_response.status_code == 200

        user_data = me_response.json()
        assert user_data["email"] == "flowtest@example.com"
        assert user_data["first_name"] == "Flow"
        assert user_data["last_name"] == "Test"

        # 4. Refresh token
        refresh_data = {"refresh_token": refresh_token}
        refresh_response = client.post("/api/auth/refresh", json=refresh_data)
        assert refresh_response.status_code == 200

        new_tokens = refresh_response.json()
        new_access_token = new_tokens["access_token"]

        # 5. Use new access token
        new_headers = {"Authorization": f"Bearer {new_access_token}"}
        me_response_2 = client.get("/api/auth/me", headers=new_headers)
        assert me_response_2.status_code == 200

        # 6. Logout
        logout_response = client.post("/api/auth/logout", headers=new_headers)
        assert logout_response.status_code == 200
