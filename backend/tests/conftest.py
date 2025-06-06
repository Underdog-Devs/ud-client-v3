"""
Pytest configuration and fixtures for testing.
Simplified version for initial project setup - will be enhanced when FastAPI dependencies are installed.
"""

import pytest
import os
from app.core.config import settings

# Set test environment variables
os.environ["ENVIRONMENT"] = "testing"
os.environ["DEBUG"] = "True"


@pytest.fixture
def app_config():
    """Get app configuration for testing."""
    from app.main import app
    return app


@pytest.fixture
def health_check():
    """Test health check function."""
    from app.main import health_check
    return health_check()


@pytest.fixture
def root_endpoint():
    """Test root endpoint function."""
    from app.main import root
    return root()


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
