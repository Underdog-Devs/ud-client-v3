"""
API data factories for testing endpoints and responses.
"""

import factory
from faker import Faker

fake = Faker()


class APIResponseFactory(factory.DictFactory):
    """Factory for testing API response structures."""

    message = factory.LazyFunction(lambda: fake.sentence(nb_words=3))
    version = "0.1.0"
    environment = "testing"
    status = "running"


class HealthCheckFactory(factory.DictFactory):
    """Factory for health check responses."""

    status = "healthy"
    environment = "testing"
    debug = True


class APIInfoFactory(factory.DictFactory):
    """Factory for API info responses."""

    title = "UnderdogDevs API"
    description = "Backend API for UnderdogDevs learning platform"
    version = "0.1.0"
    environment = "testing"
    debug_mode = True
    docs_url = "/docs"
    cors_origins = factory.LazyFunction(
        lambda: ["http://localhost:3001", "http://localhost:5173"]
    )


class UserDataFactory(factory.DictFactory):
    """Factory for user test data."""

    id = factory.Sequence(lambda n: n)
    email = factory.LazyAttribute(lambda obj: fake.email())
    first_name = factory.LazyFunction(lambda: fake.first_name())
    last_name = factory.LazyFunction(lambda: fake.last_name())
    is_active = True
    created_at = factory.LazyFunction(lambda: fake.date_time_this_year())
    updated_at = factory.LazyFunction(lambda: fake.date_time_this_year())
