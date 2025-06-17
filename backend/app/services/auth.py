"""
Authentication service for user registration, login, and token management.
"""

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

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
from app.models.user import User, UserProfile
from app.schemas.auth import (
    PasswordReset,
    PasswordResetRequest,
    Token,
    UserCreate,
    UserLogin,
    UserResponse,
)


class AuthService:
    """Service for authentication operations."""

    def __init__(self, db_session: Session):
        self.db = db_session

    def register_user(self, user_data: UserCreate) -> User:
        """
        Register a new user.

        Args:
            user_data: User registration data

        Returns:
            The created user

        Raises:
            ValueError: If email already exists
        """
        # Check if user already exists
        existing_user = self.get_user_by_email(user_data.email)
        if existing_user:
            raise ValueError("Email already registered")

        # Hash password
        hashed_password = get_password_hash(user_data.password)

        # Create user
        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            is_active=True,
            is_verified=False,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

        self.db.add(user)
        self.db.flush()  # Flush to get the user ID

        # Create user profile if additional data provided
        if user_data.first_name or user_data.last_name:
            profile = UserProfile(
                user_id=user.id,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                created_at=datetime.now(UTC),
                updated_at=datetime.now(UTC),
            )
            self.db.add(profile)

        self.db.commit()
        self.db.refresh(user)

        return user

    def authenticate_user(self, login_data: UserLogin) -> User | None:
        """
        Authenticate a user with email and password.

        Args:
            login_data: User login credentials

        Returns:
            The authenticated user or None if invalid
        """
        user = self.get_user_by_email(login_data.email)
        if not user:
            return None

        if not user.is_active:
            return None

        if not verify_password(login_data.password, user.password_hash):
            return None

        # Update last login
        user.last_login = datetime.now(UTC)
        user.updated_at = datetime.now(UTC)
        self.db.commit()

        return user

    def get_user_by_email(self, email: str) -> User | None:
        """
        Get a user by email.

        Args:
            email: User email address

        Returns:
            The user or None if not found
        """
        result = self.db.execute(
            select(User)
            .options(selectinload(User.profile), selectinload(User.role))
            .where(User.email == email)
        )
        return result.scalar_one_or_none()

    def get_user_by_id(self, user_id: int) -> User | None:
        """
        Get a user by ID.

        Args:
            user_id: User ID

        Returns:
            The user or None if not found
        """
        result = self.db.execute(
            select(User)
            .options(selectinload(User.profile), selectinload(User.role))
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    def create_tokens_for_user(self, user: User) -> Token:
        """
        Create access and refresh tokens for a user.

        Args:
            user: The user to create tokens for

        Returns:
            Token response with access and refresh tokens
        """
        token_data = {
            "sub": user.email,
            "user_id": user.id,
        }

        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
        )

    def refresh_access_token(self, refresh_token: str) -> Token | None:
        """
        Create a new access token from a refresh token.

        Args:
            refresh_token: The refresh token

        Returns:
            New token response or None if invalid
        """
        # Verify refresh token
        payload = verify_token(refresh_token)
        if not payload:
            return None

        # Check if it's actually a refresh token
        if payload.get("type") != "refresh":
            return None

        # Get user
        user_id = payload.get("user_id")
        if not user_id:
            return None

        user = self.get_user_by_id(user_id)
        if not user or not user.is_active:
            return None

        # Create new tokens
        return self.create_tokens_for_user(user)

    def get_current_user_from_token(self, token: str) -> User | None:
        """
        Get the current user from an access token.

        Args:
            token: The access token

        Returns:
            The current user or None if invalid
        """
        payload = verify_token(token)
        if not payload:
            return None

        # Skip refresh tokens
        if payload.get("type") == "refresh":
            return None

        user_id = payload.get("user_id")
        if not user_id:
            return None

        user = self.get_user_by_id(user_id)
        if not user or not user.is_active:
            return None

        return user

    def convert_user_to_response(self, user: User) -> UserResponse:
        """
        Convert a User model to UserResponse schema.

        Args:
            user: The user model

        Returns:
            UserResponse schema
        """
        response_data = {
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at,
            "last_login": user.last_login,
        }

        # Add profile data if available
        if user.profile:
            response_data.update({
                "first_name": user.profile.first_name,
                "last_name": user.profile.last_name,
                "bio": user.profile.bio,
                "location": user.profile.location,
                "website": user.profile.website,
                "github_username": user.profile.github_username,
                "linkedin_url": user.profile.linkedin_url,
                "avatar_url": user.profile.avatar_url,
            })

        # Add role data if available
        if user.role:
            response_data["role_name"] = user.role.name

        return UserResponse(**response_data)

    def request_password_reset(self, reset_request: PasswordResetRequest) -> str | None:
        """
        Generate a password reset token for a user.

        Args:
            reset_request: Password reset request data

        Returns:
            The password reset token if user exists, None otherwise
        """
        user = self.get_user_by_email(reset_request.email)
        if not user or not user.is_active:
            # Don't reveal if email exists for security
            return None

        # Generate password reset token
        reset_token = create_password_reset_token(user.email)
        return reset_token

    def reset_password(self, reset_data: PasswordReset) -> bool:
        """
        Reset a user's password using a reset token.

        Args:
            reset_data: Password reset data with token and new password

        Returns:
            True if password was reset successfully, False otherwise
        """
        # Verify the reset token
        email = verify_password_reset_token(reset_data.token)
        if not email:
            return False

        # Get the user
        user = self.get_user_by_email(email)
        if not user or not user.is_active:
            return False

        # Update the password
        user.password_hash = get_password_hash(reset_data.new_password)
        user.updated_at = datetime.now(UTC)

        self.db.commit()
        return True

    def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        """
        Change a user's password after verifying their current password.

        Args:
            user_id: The user's ID
            current_password: The user's current password
            new_password: The new password

        Returns:
            True if password was changed successfully, False otherwise
        """
        user = self.get_user_by_id(user_id)
        if not user or not user.is_active:
            return False

        # Verify current password
        if not verify_password(current_password, user.password_hash):
            return False

        # Update password
        user.password_hash = get_password_hash(new_password)
        user.updated_at = datetime.now(UTC)

        self.db.commit()
        return True
