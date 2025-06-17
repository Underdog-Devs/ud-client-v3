"""
Authentication API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import (
    ChangePassword,
    LoginResponse,
    MessageResponse,
    PasswordReset,
    PasswordResetRequest,
    RefreshToken,
    UserCreate,
    UserCreateResponse,
    UserLogin,
    UserResponse,
)
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Dependency to get auth service."""
    return AuthService(db)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
) -> UserResponse:
    """
    Dependency to get the current authenticated user.

    Args:
        credentials: HTTP authorization credentials
        auth_service: Authentication service

    Returns:
        Current user response

    Raises:
        HTTPException: If token is invalid or user not found
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = auth_service.get_current_user_from_token(credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return auth_service.convert_user_to_response(user)


@router.post("/register", response_model=UserCreateResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service),
) -> UserCreateResponse:
    """
    Register a new user.

    Args:
        user_data: User registration data
        auth_service: Authentication service

    Returns:
        User creation response

    Raises:
        HTTPException: If email already exists or validation fails
    """
    try:
        user = auth_service.register_user(user_data)
        user_response = auth_service.convert_user_to_response(user)

        return UserCreateResponse(
            user=user_response,
            message="User registered successfully"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user"
        ) from e


@router.post("/login", response_model=LoginResponse)
def login(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
) -> LoginResponse:
    """
    Authenticate user and return tokens.

    Args:
        login_data: User login credentials
        auth_service: Authentication service

    Returns:
        Login response with user data and tokens

    Raises:
        HTTPException: If credentials are invalid
    """
    user = auth_service.authenticate_user(login_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_response = auth_service.convert_user_to_response(user)
    tokens = auth_service.create_tokens_for_user(user)

    return LoginResponse(
        user=user_response,
        token=tokens,
        message="Login successful"
    )


@router.post("/refresh", response_model=MessageResponse)
def refresh_token(
    refresh_data: RefreshToken,
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Refresh access token using refresh token.

    Args:
        refresh_data: Refresh token data
        auth_service: Authentication service

    Returns:
        New token response

    Raises:
        HTTPException: If refresh token is invalid
    """
    new_tokens = auth_service.refresh_access_token(refresh_data.refresh_token)
    if not new_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return new_tokens


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """
    Get current authenticated user information.

    Args:
        current_user: Current authenticated user

    Returns:
        Current user data
    """
    return current_user


@router.post("/logout", response_model=MessageResponse)
def logout(
    current_user: UserResponse = Depends(get_current_user),
) -> MessageResponse:
    """
    Logout current user.

    Note: In a JWT-based system, logout is primarily handled on the client side
    by removing the token. This endpoint provides a place for server-side logout
    logic if needed (e.g., token blacklisting).

    Args:
        current_user: Current authenticated user

    Returns:
        Logout confirmation message
    """
    # In a JWT system, we typically rely on client-side token removal
    # Server-side logout could involve:
    # - Adding token to blacklist
    # - Logging the logout event
    # - Clearing server-side sessions if any

    return MessageResponse(message="Logged out successfully")


# Health check endpoint for authentication service
@router.post("/password-reset/request", response_model=MessageResponse)
def request_password_reset(
    reset_request: PasswordResetRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    """
    Request a password reset token.

    Args:
        reset_request: Password reset request data
        auth_service: Authentication service

    Returns:
        Success message (always returns success for security)

    Note:
        This endpoint always returns success to avoid revealing whether
        an email address exists in the system. The actual reset token
        is only generated for valid, active users.
    """
    # Generate reset token (returns None if user doesn't exist)
    reset_token = auth_service.request_password_reset(reset_request)

    # TODO we need to send the reset_token via email
    # For now, we'll just log it (remove this in production)
    if reset_token:
        print(f"Password reset token for {reset_request.email}: {reset_token}")

    # Always return success for security (don't reveal if email exists)
    return MessageResponse(
        message="If your email address exists in our system, you will receive a password reset link shortly."
    )


@router.post("/password-reset/confirm", response_model=MessageResponse)
def confirm_password_reset(
    reset_data: PasswordReset,
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    """
    Confirm password reset with token and new password.

    Args:
        reset_data: Password reset data with token and new password
        auth_service: Authentication service

    Returns:
        Success or error message

    Raises:
        HTTPException: If reset token is invalid or expired
    """
    success = auth_service.reset_password(reset_data)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token"
        )

    return MessageResponse(message="Password has been reset successfully")


@router.post("/change-password", response_model=MessageResponse)
def change_password(
    password_data: ChangePassword,
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    """
    Change user password (requires authentication).

    Args:
        password_data: Current and new password data
        current_user: Current authenticated user
        auth_service: Authentication service

    Returns:
        Success or error message

    Raises:
        HTTPException: If current password is incorrect
    """
    success = auth_service.change_password(
        current_user.id,
        password_data.current_password,
        password_data.new_password
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    return MessageResponse(message="Password changed successfully")


@router.get("/health", response_model=MessageResponse)
def auth_health_check() -> MessageResponse:
    """
    Health check for authentication service.

    Returns:
        Health status message
    """
    return MessageResponse(message="Authentication service is healthy")
