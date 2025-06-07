"""
Test the SQLAlchemy model factories.
"""

import pytest

from app.models.user import User, UserProfile, UserRole
from tests.factories import (
    CompleteUserFactory,
    UserFactory,
    UserProfileFactory,
    UserRoleFactory,
    UserWithoutRoleFactory,
    configure_factories,
    reset_factory_sequences,
)


@pytest.mark.integration
class TestUserRoleFactory:
    """Test the UserRoleFactory."""

    def test_create_user_role(self, db_session):
        """Test creating a user role with factory."""
        configure_factories(db_session)

        role = UserRoleFactory()

        assert isinstance(role, UserRole)
        assert role.id is not None
        assert role.name is not None
        assert role.description is not None
        assert role.created_at is not None

        # Verify it's saved to database
        saved_role = db_session.get(UserRole, role.id)
        assert saved_role == role

    def test_create_multiple_user_roles(self, db_session):
        """Test creating multiple user roles with unique names."""
        configure_factories(db_session)
        reset_factory_sequences()

        role1 = UserRoleFactory()
        role2 = UserRoleFactory()

        assert role1.name != role2.name
        assert role1.id != role2.id

    def test_custom_user_role_attributes(self, db_session):
        """Test creating user role with custom attributes."""
        configure_factories(db_session)

        role = UserRoleFactory(
            name="custom_mentor",
            description="Custom mentor role description"
        )

        assert role.name == "custom_mentor"
        assert role.description == "Custom mentor role description"


@pytest.mark.integration
class TestUserFactory:
    """Test the UserFactory."""

    def test_create_user(self, db_session):
        """Test creating a user with factory."""
        configure_factories(db_session)

        user = UserFactory()

        assert isinstance(user, User)
        assert user.id is not None
        assert user.email is not None
        assert user.password_hash is not None
        assert user.is_active is True
        assert user.is_verified is False
        assert user.created_at is not None
        assert user.updated_at is not None
        assert user.last_login is None

        # Should have a role by default
        assert user.role is not None
        assert user.role_id is not None

    def test_create_user_without_role(self, db_session):
        """Test creating a user without role."""
        configure_factories(db_session)

        user = UserWithoutRoleFactory()

        assert isinstance(user, User)
        assert user.role is None
        assert user.role_id is None

    def test_create_multiple_users(self, db_session):
        """Test creating multiple users with unique emails."""
        configure_factories(db_session)
        reset_factory_sequences()

        user1 = UserWithoutRoleFactory()
        user2 = UserWithoutRoleFactory()

        assert user1.email != user2.email
        assert user1.id != user2.id

    def test_custom_user_attributes(self, db_session):
        """Test creating user with custom attributes."""
        configure_factories(db_session)

        user = UserWithoutRoleFactory(
            email="custom@example.com",
            is_verified=True
        )

        assert user.email == "custom@example.com"
        assert user.is_verified is True


@pytest.mark.integration
class TestUserProfileFactory:
    """Test the UserProfileFactory."""

    def test_create_user_profile(self, db_session):
        """Test creating a user profile with factory."""
        configure_factories(db_session)

        profile = UserProfileFactory()

        assert isinstance(profile, UserProfile)
        assert profile.id is not None
        assert profile.user_id is not None
        assert profile.user is not None
        assert profile.first_name is not None
        assert profile.last_name is not None
        assert profile.bio is not None
        assert profile.location is not None
        assert profile.website is not None
        assert profile.github_username is not None
        assert profile.linkedin_url is not None
        assert profile.avatar_url is not None
        assert profile.timezone is not None
        assert profile.created_at is not None
        assert profile.updated_at is not None

    def test_user_profile_relationship(self, db_session):
        """Test the user-profile relationship in factory."""
        configure_factories(db_session)

        profile = UserProfileFactory()

        # Test bidirectional relationship
        assert profile.user.profile == profile

    def test_full_name_property(self, db_session):
        """Test the full_name property with factory data."""
        configure_factories(db_session)

        profile = UserProfileFactory()

        expected_full_name = f"{profile.first_name} {profile.last_name}"
        assert profile.full_name == expected_full_name

    def test_custom_profile_attributes(self, db_session):
        """Test creating profile with custom attributes."""
        configure_factories(db_session)

        profile = UserProfileFactory(
            first_name="Custom",
            last_name="User",
            bio="Custom bio text"
        )

        assert profile.first_name == "Custom"
        assert profile.last_name == "User"
        assert profile.bio == "Custom bio text"
        assert profile.full_name == "Custom User"


@pytest.mark.integration
class TestCompleteUserFactory:
    """Test the CompleteUserFactory."""

    def test_create_complete_user(self, db_session):
        """Test creating a complete user with role and profile."""
        configure_factories(db_session)

        user = CompleteUserFactory()

        assert isinstance(user, User)
        assert user.id is not None
        assert user.email is not None
        assert user.is_verified is True

        # Should have role
        assert user.role is not None
        assert user.role_id is not None
        assert isinstance(user.role, UserRole)

        # Should have profile
        assert user.profile is not None
        assert isinstance(user.profile, UserProfile)
        assert user.profile.user == user

    def test_complete_user_relationships(self, db_session):
        """Test all relationships in complete user."""
        configure_factories(db_session)

        user = CompleteUserFactory()

        # Test user -> role
        assert user.role.users[0] == user

        # Test user -> profile -> user
        assert user.profile.user == user

        # Test accessing nested attributes
        assert user.profile.full_name is not None
        assert user.role.name is not None

    def test_multiple_complete_users(self, db_session):
        """Test creating multiple complete users."""
        configure_factories(db_session)
        reset_factory_sequences()

        user1 = CompleteUserFactory()
        user2 = CompleteUserFactory()

        # Users should be different
        assert user1.id != user2.id
        assert user1.email != user2.email

        # Roles should be different
        assert user1.role.id != user2.role.id
        assert user1.role.name != user2.role.name

        # Profiles should be different
        assert user1.profile.id != user2.profile.id
        assert user1.profile.first_name != user2.profile.first_name


@pytest.mark.integration
class TestFactoryConfiguration:
    """Test factory configuration and utility functions."""

    def test_configure_factories(self, db_session):
        """Test configuring factories with session."""
        configure_factories(db_session)

        # All factories should use the same session
        assert UserRoleFactory._meta.sqlalchemy_session == db_session
        assert UserFactory._meta.sqlalchemy_session == db_session
        assert UserProfileFactory._meta.sqlalchemy_session == db_session

    def test_reset_factory_sequences(self, db_session):
        """Test resetting factory sequences."""
        configure_factories(db_session)

        # Create some objects to advance sequences
        first_role = UserRoleFactory()
        first_user = UserWithoutRoleFactory()

        # Reset sequences
        reset_factory_sequences()

        # Next objects should be created successfully
        second_role = UserRoleFactory()
        second_user = UserWithoutRoleFactory()

        # Verify that objects are different and can be created
        assert first_role.id != second_role.id
        assert first_user.id != second_user.id
        assert second_role.id is not None
        assert second_user.id is not None
