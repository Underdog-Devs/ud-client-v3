"""
SQLAlchemy model factories for database testing.
"""

from datetime import UTC, datetime

import factory
from faker import Faker
from sqlalchemy.orm import Session

from app.models.user import User, UserProfile, UserRole

fake = Faker()


class UserRoleFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for UserRole model."""

    class Meta:
        model = UserRole
        sqlalchemy_session_persistence = "commit"

    name = factory.LazyAttribute(lambda obj: fake.unique.word())
    description = factory.LazyAttribute(lambda obj: fake.sentence())
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))


class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for User model."""

    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    email = factory.LazyAttribute(lambda obj: fake.unique.email())
    password_hash = factory.LazyAttribute(lambda obj: fake.sha256())
    is_active = True
    is_verified = False
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))
    last_login = None

    # Optional role relationship
    role = factory.SubFactory(UserRoleFactory)
    role_id = factory.LazyAttribute(lambda obj: obj.role.id if obj.role else None)


class UserWithoutRoleFactory(UserFactory):
    """Factory for User model without a role."""

    role = None
    role_id = None


class UserProfileFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for UserProfile model."""

    class Meta:
        model = UserProfile
        sqlalchemy_session_persistence = "commit"

    user = factory.SubFactory(UserWithoutRoleFactory)
    user_id = factory.LazyAttribute(lambda obj: obj.user.id)
    first_name = factory.LazyAttribute(lambda obj: fake.first_name())
    last_name = factory.LazyAttribute(lambda obj: fake.last_name())
    bio = factory.LazyAttribute(lambda obj: fake.paragraph(nb_sentences=3))
    location = factory.LazyAttribute(lambda obj: f"{fake.city()}, {fake.state_abbr()}")
    website = factory.LazyAttribute(lambda obj: fake.url())
    github_username = factory.LazyAttribute(lambda obj: fake.user_name())
    linkedin_url = factory.LazyAttribute(
        lambda obj: f"https://linkedin.com/in/{fake.user_name()}"
    )
    avatar_url = factory.LazyAttribute(lambda obj: fake.image_url())
    timezone = factory.LazyAttribute(lambda obj: fake.timezone())
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))


class CompleteUserFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for User with complete profile and role."""

    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    email = factory.LazyAttribute(lambda obj: fake.unique.email())
    password_hash = factory.LazyAttribute(lambda obj: fake.sha256())
    is_active = True
    is_verified = True
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))
    last_login = factory.LazyFunction(lambda: datetime.now(UTC))

    # Role relationship
    role = factory.SubFactory(UserRoleFactory)
    role_id = factory.LazyAttribute(lambda obj: obj.role.id)

    # Profile relationship
    profile = factory.RelatedFactory(
        UserProfileFactory,
        "user",
        first_name=factory.LazyAttribute(lambda obj: fake.first_name()),
        last_name=factory.LazyAttribute(lambda obj: fake.last_name()),
    )


# Factory configuration functions
def configure_factories(session: Session):
    """Configure all factories to use the provided database session."""
    UserRoleFactory._meta.sqlalchemy_session = session
    UserFactory._meta.sqlalchemy_session = session
    UserWithoutRoleFactory._meta.sqlalchemy_session = session
    UserProfileFactory._meta.sqlalchemy_session = session
    CompleteUserFactory._meta.sqlalchemy_session = session


def reset_factory_sequences():
    """Reset factory sequences for consistent test data."""
    UserRoleFactory.reset_sequence()
    UserFactory.reset_sequence(force=True)
    UserWithoutRoleFactory.reset_sequence(force=True)
    UserProfileFactory.reset_sequence()
    CompleteUserFactory.reset_sequence(force=True)
