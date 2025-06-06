"""
Test the factory-boy factories for generating test data.
"""

import pytest

from tests.factories import (
    APIInfoFactory,
    APIResponseFactory,
    HealthCheckFactory,
    UserDataFactory,
)


@pytest.mark.unit
def test_api_response_factory():
    """Test that APIResponseFactory generates valid data."""
    response = APIResponseFactory.build()

    assert isinstance(response["message"], str)
    assert response["version"] == "0.1.0"
    assert response["environment"] == "testing"
    assert response["status"] == "running"


@pytest.mark.unit
def test_health_check_factory():
    """Test that HealthCheckFactory generates valid data."""
    health = HealthCheckFactory.build()

    assert health["status"] == "healthy"
    assert health["environment"] == "testing"
    assert health["debug"] is True


@pytest.mark.unit
def test_api_info_factory():
    """Test that APIInfoFactory generates valid data."""
    info = APIInfoFactory.build()

    assert info["title"] == "UnderdogDevs API"
    assert info["description"] == "Backend API for UnderdogDevs learning platform"
    assert info["version"] == "0.1.0"
    assert info["environment"] == "testing"
    assert info["debug_mode"] is True
    assert info["docs_url"] == "/docs"
    assert isinstance(info["cors_origins"], list)
    assert len(info["cors_origins"]) > 0


@pytest.mark.unit
def test_user_data_factory():
    """Test that UserDataFactory generates valid user data."""
    user = UserDataFactory.build()

    assert isinstance(user["id"], int)
    assert isinstance(user["email"], str)
    assert "@" in user["email"]
    assert isinstance(user["first_name"], str)
    assert isinstance(user["last_name"], str)
    assert user["is_active"] is True
    assert user["created_at"] is not None
    assert user["updated_at"] is not None


@pytest.mark.unit
def test_factory_generates_unique_data():
    """Test that factories generate unique data for different instances."""
    user1 = UserDataFactory.build()
    user2 = UserDataFactory.build()

    assert user1["id"] != user2["id"]
    assert user1["email"] != user2["email"]
    assert user1["first_name"] != user2["first_name"]  # statistically very unlikely to be same
