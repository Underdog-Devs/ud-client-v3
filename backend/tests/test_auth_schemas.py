"""
Tests for authentication Pydantic schemas.
"""

from datetime import datetime

import pytest
from pydantic import ValidationError

from app.schemas.auth import (
    AuthError,
    ChangePassword,
    LoginResponse,
    MessageResponse,
    PasswordReset,
    PasswordResetRequest,
    RefreshToken,
    Token,
    TokenData,
    UserCreate,
    UserCreateResponse,
    UserLogin,
    UserResponse,
)


class TestUserCreate:
    """Test UserCreate schema validation."""

    def test_user_create_valid(self):
        """Test valid user creation data."""
        data = {
            "email": "test@example.com",
            "password": "StrongPass123",
            "first_name": "John",
            "last_name": "Doe"
        }

        user = UserCreate(**data)

        assert user.email == "test@example.com"
        assert user.password == "StrongPass123"
        assert user.first_name == "John"
        assert user.last_name == "Doe"

    def test_user_create_minimal(self):
        """Test user creation with minimal required fields."""
        data = {
            "email": "test@example.com",
            "password": "StrongPass123"
        }

        user = UserCreate(**data)

        assert user.email == "test@example.com"
        assert user.password == "StrongPass123"
        assert user.first_name is None
        assert user.last_name is None

    def test_user_create_invalid_email(self):
        """Test user creation with invalid email."""
        data = {
            "email": "invalid-email",
            "password": "StrongPass123"
        }

        with pytest.raises(ValidationError) as exc_info:
            UserCreate(**data)

        errors = exc_info.value.errors()
        assert any(error["type"] == "value_error" for error in errors)

    def test_user_create_weak_password(self):
        """Test user creation with weak password."""
        weak_passwords = [
            "short",  # Too short
            "lowercase123",  # No uppercase
            "UPPERCASE123",  # No lowercase
            "NoNumbers",  # No digits
            "weakpass"  # Too short and weak
        ]

        for weak_password in weak_passwords:
            data = {
                "email": "test@example.com",
                "password": weak_password
            }

            with pytest.raises(ValidationError):
                UserCreate(**data)

    def test_user_create_password_validation(self):
        """Test password validation rules."""
        # Valid strong password
        valid_data = {
            "email": "test@example.com",
            "password": "StrongPass123"
        }
        user = UserCreate(**valid_data)
        assert user.password == "StrongPass123"

    def test_user_create_long_fields(self):
        """Test validation of field length limits."""
        data = {
            "email": "test@example.com",
            "password": "StrongPass123",
            "first_name": "A" * 101,  # Over 100 char limit
            "last_name": "B" * 101     # Over 100 char limit
        }

        with pytest.raises(ValidationError):
            UserCreate(**data)


class TestUserLogin:
    """Test UserLogin schema validation."""

    def test_user_login_valid(self):
        """Test valid login data."""
        data = {
            "email": "test@example.com",
            "password": "password123"
        }

        login = UserLogin(**data)

        assert login.email == "test@example.com"
        assert login.password == "password123"

    def test_user_login_invalid_email(self):
        """Test login with invalid email."""
        data = {
            "email": "invalid-email",
            "password": "password123"
        }

        with pytest.raises(ValidationError):
            UserLogin(**data)

    def test_user_login_missing_fields(self):
        """Test login with missing required fields."""
        # Missing password
        with pytest.raises(ValidationError):
            UserLogin(email="test@example.com")

        # Missing email
        with pytest.raises(ValidationError):
            UserLogin(password="password123")


class TestUserResponse:
    """Test UserResponse schema."""

    def test_user_response_minimal(self):
        """Test user response with minimal required fields."""
        data = {
            "id": 1,
            "email": "test@example.com",
            "is_active": True,
            "is_verified": False,
            "created_at": datetime.now()
        }

        user = UserResponse(**data)

        assert user.id == 1
        assert user.email == "test@example.com"
        assert user.is_active is True
        assert user.is_verified is False
        assert isinstance(user.created_at, datetime)

    def test_user_response_full(self):
        """Test user response with all fields."""
        data = {
            "id": 1,
            "email": "test@example.com",
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.now(),
            "last_login": datetime.now(),
            "first_name": "John",
            "last_name": "Doe",
            "bio": "Software developer",
            "location": "San Francisco",
            "website": "https://johndoe.com",
            "github_username": "johndoe",
            "linkedin_url": "https://linkedin.com/in/johndoe",
            "avatar_url": "https://example.com/avatar.jpg",
            "role_name": "mentor"
        }

        user = UserResponse(**data)

        assert user.first_name == "John"
        assert user.last_name == "Doe"
        assert user.bio == "Software developer"
        assert user.role_name == "mentor"


class TestToken:
    """Test Token schema."""

    def test_token_valid(self):
        """Test valid token schema."""
        data = {
            "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "expires_in": 1800
        }

        token = Token(**data)

        assert token.access_token.startswith("eyJ")
        assert token.refresh_token.startswith("eyJ")
        assert token.token_type == "bearer"  # Default value
        assert token.expires_in == 1800

    def test_token_custom_type(self):
        """Test token with custom token type."""
        data = {
            "access_token": "access_token_here",
            "refresh_token": "refresh_token_here",
            "token_type": "Bearer",
            "expires_in": 3600
        }

        token = Token(**data)

        assert token.token_type == "Bearer"


class TestTokenData:
    """Test TokenData schema."""

    def test_token_data_valid(self):
        """Test valid token data."""
        data = {
            "email": "test@example.com",
            "user_id": 123,
            "exp": 1234567890
        }

        token_data = TokenData(**data)

        assert token_data.email == "test@example.com"
        assert token_data.user_id == 123
        assert token_data.exp == 1234567890

    def test_token_data_optional_fields(self):
        """Test token data with optional fields."""
        # All fields optional
        token_data = TokenData()

        assert token_data.email is None
        assert token_data.user_id is None
        assert token_data.exp is None


class TestPasswordSchemas:
    """Test password-related schemas."""

    def test_password_reset_request(self):
        """Test password reset request schema."""
        data = {"email": "test@example.com"}

        request = PasswordResetRequest(**data)

        assert request.email == "test@example.com"

    def test_password_reset(self):
        """Test password reset schema."""
        data = {
            "token": "reset_token_here",
            "new_password": "NewStrongPass123"
        }

        reset = PasswordReset(**data)

        assert reset.token == "reset_token_here"
        assert reset.new_password == "NewStrongPass123"

    def test_password_reset_weak_password(self):
        """Test password reset with weak password."""
        data = {
            "token": "reset_token_here",
            "new_password": "weak"
        }

        with pytest.raises(ValidationError):
            PasswordReset(**data)

    def test_change_password(self):
        """Test change password schema."""
        data = {
            "current_password": "OldPass123",
            "new_password": "NewStrongPass123"
        }

        change = ChangePassword(**data)

        assert change.current_password == "OldPass123"
        assert change.new_password == "NewStrongPass123"

    def test_change_password_weak_new_password(self):
        """Test change password with weak new password."""
        data = {
            "current_password": "OldPass123",
            "new_password": "weak"
        }

        with pytest.raises(ValidationError):
            ChangePassword(**data)


class TestRefreshToken:
    """Test RefreshToken schema."""

    def test_refresh_token_valid(self):
        """Test valid refresh token."""
        data = {"refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."}

        refresh = RefreshToken(**data)

        assert refresh.refresh_token.startswith("eyJ")


class TestResponseSchemas:
    """Test response schemas."""

    def test_auth_error(self):
        """Test auth error schema."""
        data = {
            "detail": "Invalid credentials",
            "error_code": "AUTH_001"
        }

        error = AuthError(**data)

        assert error.detail == "Invalid credentials"
        assert error.error_code == "AUTH_001"

    def test_message_response(self):
        """Test message response schema."""
        data = {"message": "Operation successful"}

        response = MessageResponse(**data)

        assert response.message == "Operation successful"

    def test_user_create_response(self):
        """Test user create response schema."""
        user_data = {
            "id": 1,
            "email": "test@example.com",
            "is_active": True,
            "is_verified": False,
            "created_at": datetime.now()
        }

        data = {
            "user": user_data,
            "message": "User created successfully"
        }

        response = UserCreateResponse(**data)

        assert response.user.id == 1
        assert response.message == "User created successfully"

    def test_login_response(self):
        """Test login response schema."""
        user_data = {
            "id": 1,
            "email": "test@example.com",
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.now()
        }

        token_data = {
            "access_token": "access_token_here",
            "refresh_token": "refresh_token_here",
            "expires_in": 1800
        }

        data = {
            "user": user_data,
            "token": token_data,
            "message": "Login successful"
        }

        response = LoginResponse(**data)

        assert response.user.id == 1
        assert response.token.access_token == "access_token_here"
        assert response.message == "Login successful"
