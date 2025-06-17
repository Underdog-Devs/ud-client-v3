"""
Pydantic schemas for authentication requests and responses.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr = Field(..., description="User email address")


class UserCreate(UserBase):
    """Schema for user registration."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, max_length=128, description="User password")
    first_name: str | None = Field(None, max_length=100, description="User first name")
    last_name: str | None = Field(None, max_length=100, description="User last name")

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')

        # Check for at least one uppercase, one lowercase, one digit
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')

        return v


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class UserResponse(UserBase):
    """Schema for user data in responses."""
    id: int = Field(..., description="User ID")
    email: EmailStr = Field(..., description="User email address")
    is_active: bool = Field(..., description="Whether user account is active")
    is_verified: bool = Field(..., description="Whether user email is verified")
    created_at: datetime = Field(..., description="User creation timestamp")
    last_login: datetime | None = Field(None, description="Last login timestamp")

    # User profile fields (optional)
    first_name: str | None = Field(None, description="User first name")
    last_name: str | None = Field(None, description="User last name")
    bio: str | None = Field(None, description="User biography")
    location: str | None = Field(None, description="User location")
    website: str | None = Field(None, description="User website URL")
    github_username: str | None = Field(None, description="GitHub username")
    linkedin_url: str | None = Field(None, description="LinkedIn profile URL")
    avatar_url: str | None = Field(None, description="Avatar image URL")

    # Role information
    role_name: str | None = Field(None, description="User role name")

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")


class TokenData(BaseModel):
    """Schema for token payload data."""
    email: str | None = Field(None, description="User email from token")
    user_id: int | None = Field(None, description="User ID from token")
    exp: int | None = Field(None, description="Token expiration timestamp")


class RefreshToken(BaseModel):
    """Schema for refresh token request."""
    refresh_token: str = Field(..., description="JWT refresh token")


class PasswordResetRequest(BaseModel):
    """Schema for password reset request."""
    email: EmailStr = Field(..., description="User email address")


class PasswordReset(BaseModel):
    """Schema for password reset."""
    token: str = Field(..., description="Password reset token")
    new_password: str = Field(..., min_length=8, max_length=128, description="New password")

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        """Validate new password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')

        # Check for at least one uppercase, one lowercase, one digit
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')

        return v


class ChangePassword(BaseModel):
    """Schema for changing password."""
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, max_length=128, description="New password")

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        """Validate new password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')

        # Check for at least one uppercase, one lowercase, one digit
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')

        return v


class AuthError(BaseModel):
    """Schema for authentication error responses."""
    detail: str = Field(..., description="Error message")
    error_code: str | None = Field(None, description="Specific error code")


class MessageResponse(BaseModel):
    """Schema for simple message responses."""
    message: str = Field(..., description="Response message")


# Common response schemas
class UserCreateResponse(BaseModel):
    """Schema for user creation response."""
    user: UserResponse = Field(..., description="Created user data")
    message: str = Field(..., description="Success message")


class LoginResponse(BaseModel):
    """Schema for login response."""
    user: UserResponse = Field(..., description="User data")
    token: Token = Field(..., description="Authentication tokens")
    message: str = Field(..., description="Success message")
