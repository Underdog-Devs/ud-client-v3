"""
Tests for authentication utilities (JWT and password handling).
"""

from datetime import UTC, datetime, timedelta

from jose import jwt

from app.core.auth import (
    create_access_token,
    create_password_reset_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
    verify_password_reset_token,
    verify_token,
)
from app.core.config import settings


class TestJWTTokens:
    """Test JWT token creation and verification."""

    def test_create_access_token_with_default_expiration(self):
        """Test creating an access token with default expiration."""
        test_data = {"sub": "test@example.com", "user_id": 1}

        token = create_access_token(test_data)

        assert isinstance(token, str)
        assert len(token) > 0

        # Decode and verify the token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["sub"] == "test@example.com"
        assert payload["user_id"] == 1
        assert "exp" in payload

    def test_create_access_token_with_custom_expiration(self):
        """Test creating an access token with custom expiration."""
        test_data = {"sub": "test@example.com", "user_id": 1}
        custom_delta = timedelta(minutes=60)

        token = create_access_token(test_data, expires_delta=custom_delta)

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        # Check that expiration is approximately 60 minutes from now
        exp_time = datetime.fromtimestamp(payload["exp"], tz=UTC)
        expected_time = datetime.now(UTC) + custom_delta

        # Allow 5 second tolerance for test execution time
        assert abs((exp_time - expected_time).total_seconds()) < 5

    def test_create_refresh_token(self):
        """Test creating a refresh token."""
        test_data = {"sub": "test@example.com", "user_id": 1}

        token = create_refresh_token(test_data)

        assert isinstance(token, str)
        assert len(token) > 0

        # Decode and verify the token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["sub"] == "test@example.com"
        assert payload["user_id"] == 1
        assert payload["type"] == "refresh"
        assert "exp" in payload

        # Check that expiration is approximately 7 days from now
        exp_time = datetime.fromtimestamp(payload["exp"], tz=UTC)
        expected_time = datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        # Allow 5 second tolerance for test execution time
        assert abs((exp_time - expected_time).total_seconds()) < 5

    def test_verify_token_valid(self):
        """Test verifying a valid token."""
        test_data = {"sub": "test@example.com", "user_id": 1}
        token = create_access_token(test_data)

        payload = verify_token(token)

        assert payload is not None
        assert payload["sub"] == "test@example.com"
        assert payload["user_id"] == 1
        assert "exp" in payload

    def test_verify_token_invalid(self):
        """Test verifying an invalid token."""
        invalid_token = "invalid.token.string"

        payload = verify_token(invalid_token)

        assert payload is None

    def test_verify_token_expired(self):
        """Test verifying an expired token."""
        test_data = {"sub": "test@example.com", "user_id": 1}
        # Create token that expires immediately
        expired_delta = timedelta(seconds=-1)
        token = create_access_token(test_data, expires_delta=expired_delta)

        payload = verify_token(token)

        assert payload is None

    def test_verify_token_wrong_secret(self):
        """Test verifying a token with wrong secret key."""
        test_data = {"sub": "test@example.com", "user_id": 1}

        # Create token with wrong secret
        wrong_token = jwt.encode(test_data, "wrong-secret", algorithm=settings.ALGORITHM)

        payload = verify_token(wrong_token)

        assert payload is None


class TestPasswordHashing:
    """Test password hashing and verification."""

    def test_get_password_hash(self):
        """Test password hashing."""
        password = "test_password_123"

        hashed = get_password_hash(password)

        assert isinstance(hashed, str)
        assert len(hashed) > 0
        assert hashed != password  # Ensure it's actually hashed
        assert hashed.startswith("$2b$")  # bcrypt hash format

    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        password = "test_password_123"
        hashed = get_password_hash(password)

        result = verify_password(password, hashed)

        assert result is True

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        password = "test_password_123"
        wrong_password = "wrong_password_456"
        hashed = get_password_hash(password)

        result = verify_password(wrong_password, hashed)

        assert result is False

    def test_password_hash_uniqueness(self):
        """Test that same password produces different hashes (due to salt)."""
        password = "test_password_123"

        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)

        assert hash1 != hash2  # Different due to salt
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True

    def test_empty_password_handling(self):
        """Test handling of empty password."""
        empty_password = ""

        hashed = get_password_hash(empty_password)

        assert isinstance(hashed, str)
        assert verify_password(empty_password, hashed) is True
        assert verify_password("not_empty", hashed) is False


class TestAuthIntegration:
    """Integration tests for authentication components."""

    def test_full_auth_flow(self):
        """Test a complete authentication flow."""
        # 1. Hash a password
        original_password = "user_password_123"
        hashed_password = get_password_hash(original_password)

        # 2. Create tokens
        user_data = {"sub": "user@example.com", "user_id": 42}
        access_token = create_access_token(user_data)
        refresh_token = create_refresh_token(user_data)

        # 3. Verify password
        assert verify_password(original_password, hashed_password) is True
        assert verify_password("wrong_password", hashed_password) is False

        # 4. Verify tokens
        access_payload = verify_token(access_token)
        refresh_payload = verify_token(refresh_token)

        assert access_payload is not None
        assert refresh_payload is not None
        assert access_payload["sub"] == user_data["sub"]
        assert refresh_payload["sub"] == user_data["sub"]
        assert refresh_payload["type"] == "refresh"

    def test_token_data_isolation(self):
        """Test that different tokens contain isolated data."""
        user1_data = {"sub": "user1@example.com", "user_id": 1}
        user2_data = {"sub": "user2@example.com", "user_id": 2}

        token1 = create_access_token(user1_data)
        token2 = create_access_token(user2_data)

        payload1 = verify_token(token1)
        payload2 = verify_token(token2)

        assert payload1["user_id"] == 1
        assert payload2["user_id"] == 2
        assert payload1["sub"] != payload2["sub"]


class TestPasswordResetTokens:
    """Test password reset token functionality."""

    def test_create_password_reset_token(self):
        """Test creating a password reset token."""
        email = "test@example.com"

        token = create_password_reset_token(email)

        assert isinstance(token, str)
        assert len(token) > 0

        # Decode and verify the token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["sub"] == email
        assert payload["type"] == "password_reset"
        assert "exp" in payload

    def test_password_reset_token_expiration(self):
        """Test password reset token has correct expiration."""
        email = "test@example.com"

        token = create_password_reset_token(email)
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        # Check that expiration is approximately 15 minutes from now (default)
        exp_time = datetime.fromtimestamp(payload["exp"], tz=UTC)
        expected_time = datetime.now(UTC) + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)

        # Allow 5 second tolerance for test execution time
        assert abs((exp_time - expected_time).total_seconds()) < 5

    def test_verify_password_reset_token_valid(self):
        """Test verifying a valid password reset token."""
        email = "test@example.com"
        token = create_password_reset_token(email)

        verified_email = verify_password_reset_token(token)

        assert verified_email == email

    def test_verify_password_reset_token_invalid(self):
        """Test verifying an invalid password reset token."""
        invalid_token = "invalid.token.string"

        verified_email = verify_password_reset_token(invalid_token)

        assert verified_email is None

    def test_verify_password_reset_token_wrong_type(self):
        """Test verifying an access token as password reset token."""
        # Create a regular access token
        access_token = create_access_token({"sub": "test@example.com", "user_id": 1})

        verified_email = verify_password_reset_token(access_token)

        assert verified_email is None

    def test_verify_password_reset_token_expired(self):
        """Test verifying an expired password reset token."""
        email = "test@example.com"

        # Create token that expires immediately
        reset_data = {
            "sub": email,
            "type": "password_reset",
            "exp": datetime.now(UTC) + timedelta(seconds=-1)
        }
        expired_token = jwt.encode(reset_data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

        verified_email = verify_password_reset_token(expired_token)

        assert verified_email is None

    def test_password_reset_token_isolation(self):
        """Test that different password reset tokens are isolated."""
        email1 = "user1@example.com"
        email2 = "user2@example.com"

        token1 = create_password_reset_token(email1)
        token2 = create_password_reset_token(email2)

        verified_email1 = verify_password_reset_token(token1)
        verified_email2 = verify_password_reset_token(token2)

        assert verified_email1 == email1
        assert verified_email2 == email2
        assert verified_email1 != verified_email2
