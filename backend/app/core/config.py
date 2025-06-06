"""
Application configuration - simplified for initial testing.
Will be upgraded to use Pydantic settings when dependencies are installed.
"""

import os
from typing import List


class Settings:
    """Application settings."""

    def __init__(self):
        # Environment
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        self.DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

        # Database
        self.DATABASE_URL: str = os.getenv(
            "DATABASE_URL", 
            "mysql+mysqlconnector://user:password@localhost:3306/ud_dev"
        )
        self.TEST_DATABASE_URL: str = os.getenv(
            "TEST_DATABASE_URL",
            "mysql+mysqlconnector://user:password@localhost:3306/ud_test"
        )

        # Auth
        self.SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
        self.ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        self.REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

        # CORS
        cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3001,http://localhost:5173")
        self.CORS_ORIGINS: List[str] = [origin.strip() for origin in cors_origins.split(",")]

        # Logging
        self.LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

        # Sentry
        self.SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")

        # External Services
        self.SLACK_BOT_TOKEN: str = os.getenv("SLACK_BOT_TOKEN", "")
        self.SLACK_CHANNEL_ID: str = os.getenv("SLACK_CHANNEL_ID", "")
        self.AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
        self.AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
        self.AWS_S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "ud-media")
        self.AWS_REGION: str = os.getenv("AWS_REGION", "us-east-2")

        # Strapi
        self.STRAPI_API_URL: str = os.getenv("STRAPI_API_URL", "http://localhost:1337")
        self.STRAPI_API_TOKEN: str = os.getenv("STRAPI_API_TOKEN", "")


settings = Settings()
