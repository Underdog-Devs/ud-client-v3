"""
Pytest configuration and fixtures for testing.
"""

import os

import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app

# Import database fixtures
from tests.fixtures.database import (  # noqa: F401
    clean_db,
    db_session,
    db_session_commit,
    sample_data,
    test_db_engine,
)

# Set test environment variables
os.environ["ENVIRONMENT"] = "testing"
os.environ["DEBUG"] = "True"


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def client_with_db(db_session):  # noqa: F811
    """Create a test client with database session dependency override."""
    from app.core.database import get_db

    def get_test_db():
        yield db_session

    app.dependency_overrides[get_db] = get_test_db

    yield TestClient(app)

    # Clean up dependency override
    app.dependency_overrides.clear()


@pytest.fixture
def app_instance():
    """Get the FastAPI app instance for testing."""
    return app


@pytest.fixture(autouse=True)
def setup_test_environment():
    """Set up test environment variables."""
    # Override settings for testing
    original_env = settings.ENVIRONMENT
    original_debug = settings.DEBUG

    # Set test values
    settings.ENVIRONMENT = "testing"
    settings.DEBUG = True

    yield

    # Restore original values
    settings.ENVIRONMENT = original_env
    settings.DEBUG = original_debug
