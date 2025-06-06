"""
Pytest configuration and fixtures for testing.
"""

import pytest
import os
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

# Set test environment variables
os.environ["ENVIRONMENT"] = "testing"
os.environ["DEBUG"] = "True"


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


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
