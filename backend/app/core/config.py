"""
Application configuration using Pydantic Settings v2.
"""


from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with Pydantic v2 validation."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"
    )

    # Environment
    ENVIRONMENT: str = Field(
        default="development", description="Application environment"
    )
    DEBUG: bool = Field(default=True, description="Debug mode")

    # Database
    DATABASE_URL: str = Field(
        default="mysql+mysqlconnector://user:password@localhost:3306/ud_dev",
        description="Database connection URL",
    )
    TEST_DATABASE_URL: str = Field(
        default="mysql+mysqlconnector://user:password@localhost:3306/ud_test",
        description="Test database connection URL",
    )

    # Auth
    SECRET_KEY: str = Field(
        default="dev-secret-key-change-in-production",
        description="Secret key for JWT encoding",
    )
    ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30, description="Access token expiration"
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7, description="Refresh token expiration"
    )

    # CORS
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:3001", "http://localhost:5173"],
        description="Allowed CORS origins",
    )

    # Logging
    LOG_LEVEL: str = Field(default="INFO", description="Log level")

    # Sentry
    SENTRY_DSN: str = Field(default="", description="Sentry DSN for error tracking")

    # External Services
    SLACK_BOT_TOKEN: str = Field(default="", description="Slack bot token")
    SLACK_CHANNEL_ID: str = Field(default="", description="Slack channel ID")
    AWS_ACCESS_KEY_ID: str = Field(default="", description="AWS access key")
    AWS_SECRET_ACCESS_KEY: str = Field(default="", description="AWS secret key")
    AWS_S3_BUCKET: str = Field(default="ud-media", description="S3 bucket name")
    AWS_REGION: str = Field(default="us-east-2", description="AWS region")

    # Strapi
    STRAPI_API_URL: str = Field(
        default="http://localhost:1337", description="Strapi API URL"
    )
    STRAPI_API_TOKEN: str = Field(default="", description="Strapi API token")


settings = Settings()
