"""
Test the database models.
"""

from datetime import datetime

import pytest
from sqlalchemy.exc import IntegrityError

from app.models.user import User, UserProfile, UserRole


@pytest.mark.integration
class TestUserRole:
    """Test the UserRole model."""

    def test_create_user_role(self, db_session):
        """Test creating a user role."""
        role = UserRole(
            name="mentor",
            description="Mentor role for experienced developers"
        )
        db_session.add(role)
        db_session.commit()

        assert role.id is not None
        assert role.name == "mentor"
        assert role.description == "Mentor role for experienced developers"
        assert isinstance(role.created_at, datetime)

    def test_user_role_unique_name_constraint(self, db_session):
        """Test that role names must be unique."""
        role1 = UserRole(name="admin", description="Administrator role")
        role2 = UserRole(name="admin", description="Another admin role")

        db_session.add(role1)
        db_session.commit()

        db_session.add(role2)
        with pytest.raises(IntegrityError):
            db_session.commit()

    def test_user_role_repr(self, db_session):
        """Test the UserRole string representation."""
        role = UserRole(name="student", description="Student role")
        db_session.add(role)
        db_session.commit()

        expected = f"<UserRole(id={role.id}, name=student)>"
        assert repr(role) == expected


@pytest.mark.integration
class TestUser:
    """Test the User model."""

    def test_create_user(self, db_session):
        """Test creating a user."""
        user = User(
            email="test@example.com",
            password_hash="hashed_password_123",
            is_active=True,
            is_verified=False
        )
        db_session.add(user)
        db_session.commit()

        assert user.id is not None
        assert user.email == "test@example.com"
        assert user.password_hash == "hashed_password_123"
        assert user.is_active is True
        assert user.is_verified is False
        assert isinstance(user.created_at, datetime)
        assert isinstance(user.updated_at, datetime)
        assert user.last_login is None

    def test_user_unique_email_constraint(self, db_session):
        """Test that user emails must be unique."""
        user1 = User(email="unique1@example.com", password_hash="hash1")
        user2 = User(email="unique1@example.com", password_hash="hash2")

        db_session.add(user1)
        db_session.commit()

        db_session.add(user2)
        with pytest.raises(IntegrityError):
            db_session.commit()

    def test_user_with_role(self, db_session):
        """Test creating a user with a role."""
        role = UserRole(name="developer", description="Developer role")
        db_session.add(role)
        db_session.flush()  # Get the role ID without committing

        user = User(
            email="dev@example.com",
            password_hash="hashed_password",
            role_id=role.id
        )
        db_session.add(user)
        db_session.commit()

        assert user.role == role
        assert role.users == [user]

    def test_user_defaults(self, db_session):
        """Test user model defaults."""
        user = User(email="default@example.com", password_hash="hash")
        db_session.add(user)
        db_session.commit()

        assert user.is_active is True
        assert user.is_verified is False
        assert user.role_id is None

    def test_user_repr(self, db_session):
        """Test the User string representation."""
        user = User(email="repr@example.com", password_hash="hash", is_active=True)
        db_session.add(user)
        db_session.commit()

        expected = f"<User(id={user.id}, email=repr@example.com, is_active=True)>"
        assert repr(user) == expected


@pytest.mark.integration
class TestUserProfile:
    """Test the UserProfile model."""

    def test_create_user_profile(self, db_session):
        """Test creating a user profile."""
        user = User(email="profile@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        profile = UserProfile(
            user_id=user.id,
            first_name="John",
            last_name="Doe",
            bio="Software developer and mentor",
            location="San Francisco, CA",
            website="https://johndoe.dev",
            github_username="johndoe",
            linkedin_url="https://linkedin.com/in/johndoe",
            timezone="America/Los_Angeles"
        )
        db_session.add(profile)
        db_session.commit()

        assert profile.id is not None
        assert profile.user_id == user.id
        assert profile.first_name == "John"
        assert profile.last_name == "Doe"
        assert profile.bio == "Software developer and mentor"
        assert profile.location == "San Francisco, CA"
        assert profile.website == "https://johndoe.dev"
        assert profile.github_username == "johndoe"
        assert profile.linkedin_url == "https://linkedin.com/in/johndoe"
        assert profile.timezone == "America/Los_Angeles"
        assert isinstance(profile.created_at, datetime)
        assert isinstance(profile.updated_at, datetime)

    def test_user_profile_relationship(self, db_session):
        """Test the user-profile relationship."""
        user = User(email="relationship@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        profile = UserProfile(
            user_id=user.id,
            first_name="Jane",
            last_name="Smith"
        )
        db_session.add(profile)
        db_session.commit()

        # Test relationship from profile to user
        assert profile.user == user

        # Test relationship from user to profile
        assert user.profile == profile

    def test_user_profile_unique_user_constraint(self, db_session):
        """Test that each user can have only one profile."""
        user = User(email="unique@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        profile1 = UserProfile(user_id=user.id, first_name="First")
        profile2 = UserProfile(user_id=user.id, first_name="Second")

        db_session.add(profile1)
        db_session.commit()

        db_session.add(profile2)
        with pytest.raises(IntegrityError):
            db_session.commit()

    def test_full_name_property(self, db_session):
        """Test the full_name property."""
        user = User(email="fullname@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        # Test with both first and last name
        profile1 = UserProfile(
            user_id=user.id,
            first_name="John",
            last_name="Doe"
        )
        assert profile1.full_name == "John Doe"

        # Test with only first name
        profile2 = UserProfile(
            user_id=user.id,
            first_name="Jane"
        )
        assert profile2.full_name == "Jane"

        # Test with only last name
        profile3 = UserProfile(
            user_id=user.id,
            last_name="Smith"
        )
        assert profile3.full_name == "Smith"

        # Test with no names
        profile4 = UserProfile(user_id=user.id)
        assert profile4.full_name is None

    def test_user_profile_repr(self, db_session):
        """Test the UserProfile string representation."""
        user = User(email="repr_profile@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        profile = UserProfile(
            user_id=user.id,
            first_name="Alice",
            last_name="Johnson"
        )
        db_session.add(profile)
        db_session.commit()

        expected = f"<UserProfile(id={profile.id}, user_id={user.id}, full_name=Alice Johnson)>"
        assert repr(profile) == expected


@pytest.mark.integration
class TestUserModelRelationships:
    """Test relationships between user models."""

    def test_complete_user_with_role_and_profile(self, db_session):
        """Test creating a complete user with role and profile."""
        # Create role
        role = UserRole(
            name="senior_mentor",
            description="Experienced senior developer mentor"
        )
        db_session.add(role)
        db_session.flush()

        # Create user with role
        user = User(
            email="complete_user@example.com",
            password_hash="hashed_password",
            role_id=role.id,
            is_verified=True
        )
        db_session.add(user)
        db_session.flush()

        # Create profile for user
        profile = UserProfile(
            user_id=user.id,
            first_name="Sarah",
            last_name="Wilson",
            bio="Full-stack developer with 5 years experience",
            github_username="sarahw"
        )
        db_session.add(profile)
        db_session.commit()

        # Test all relationships work
        assert user.role == role
        assert user.profile == profile
        assert profile.user == user
        assert role.users == [user]

        # Test accessing nested relationships
        assert user.role.name == "senior_mentor"
        assert user.profile.full_name == "Sarah Wilson"
        assert profile.user.role.name == "senior_mentor"

    def test_user_deletion(self, db_session):
        """Test user deletion behavior."""
        user = User(email="deletion_test@example.com", password_hash="hash")
        db_session.add(user)
        db_session.commit()

        user_id = user.id

        # Delete the user
        db_session.delete(user)
        db_session.commit()

        # Verify the user is deleted
        deleted_user = db_session.get(User, user_id)
        assert deleted_user is None
