"""
Test the main FastAPI application endpoints.
"""

import pytest
from fastapi import status


@pytest.mark.unit
def test_root_endpoint(client):
    """Test the root endpoint returns correct information."""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["message"] == "UnderdogDevs API"
    assert data["version"] == "0.1.0"
    assert data["environment"] == "testing"
    assert data["status"] == "running"


@pytest.mark.unit
def test_health_check_endpoint(client):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["status"] == "healthy"
    assert data["environment"] == "testing"
    assert data["debug"] is True


@pytest.mark.unit  
def test_api_info_endpoint(client):
    """Test the API info endpoint."""
    response = client.get("/api/info")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["title"] == "UnderdogDevs API"
    assert data["description"] == "Backend API for UnderdogDevs learning platform"
    assert data["version"] == "0.1.0"
    assert data["environment"] == "testing"
    assert data["debug_mode"] is True
    assert data["docs_url"] == "/docs"
    assert isinstance(data["cors_origins"], list)


@pytest.mark.unit
def test_fastapi_app_structure(app_instance):
    """Test the FastAPI app structure and configuration."""
    assert app_instance.title == "UnderdogDevs API"
    assert app_instance.description == "Backend API for UnderdogDevs learning platform"
    assert app_instance.version == "0.1.0"
    assert app_instance.docs_url == "/docs"
    assert app_instance.redoc_url == "/redoc"


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
