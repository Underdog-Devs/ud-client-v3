"""
Test the main application structure and functions.
Simplified tests for initial project setup - will be enhanced when FastAPI is added.
"""

import pytest


def test_app_config(app_config):
    """Test the app configuration structure."""
    assert app_config["title"] == "UnderdogDevs API"
    assert app_config["description"] == "Backend API for UnderdogDevs learning platform"
    assert app_config["version"] == "0.1.0"
    assert "environment" in app_config
    assert "debug" in app_config
    assert "cors_origins" in app_config


def test_health_check(health_check):
    """Test the health check function."""
    assert health_check["status"] == "healthy"
    assert "environment" in health_check


def test_root_endpoint(root_endpoint):
    """Test the root endpoint function."""
    assert root_endpoint["message"] == "UnderdogDevs API"
    assert root_endpoint["version"] == "0.1.0"


def test_config_loading():
    """Test that configuration loads correctly."""
    from app.core.config import settings
    
    assert settings.ENVIRONMENT in ["development", "testing", "production"]
    assert isinstance(settings.DEBUG, bool)
    assert isinstance(settings.CORS_ORIGINS, list)
    assert len(settings.CORS_ORIGINS) > 0


def test_package_imports():
    """Test that all packages can be imported."""
    # Test core imports
    from app.core.config import settings
    assert settings is not None
    
    # Test package imports
    import app.models
    import app.schemas  
    import app.api
    import app.services
    
    # If we get here, all imports work
    assert True
