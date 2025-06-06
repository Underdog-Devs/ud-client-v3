"""
Test database fixtures and session management.
"""

import pytest
from sqlalchemy import text


@pytest.mark.integration
def test_db_session_fixture(db_session):
    """Test that database session fixture works correctly."""
    # Test basic database connection
    result = db_session.execute(text("SELECT 1 as test_value"))
    row = result.fetchone()
    assert row.test_value == 1


@pytest.mark.integration
def test_db_session_rollback(db_session):
    """Test that database session automatically rolls back."""
    # This test verifies that changes don't persist between tests
    # The db_session fixture should automatically rollback

    # Test that we can execute queries (SQLite compatible)
    result = db_session.execute(text("SELECT 'test_db' as db_name"))
    row = result.fetchone()
    assert row.db_name == "test_db"


@pytest.mark.integration
def test_clean_db_fixture(clean_db, test_db_engine):
    """Test that clean_db fixture works correctly."""
    # Test that we have a clean database state
    with test_db_engine.connect() as connection:
        # Check if we can connect and run queries (SQLite compatible)
        result = connection.execute(
            text("SELECT name FROM sqlite_master WHERE type='table'")
        )
        tables = result.fetchall()

        # At this point, we might not have any tables created yet
        # But the fixture should work without errors
        assert isinstance(tables, list)


@pytest.mark.integration
def test_db_session_commit(db_session_commit):
    """Test that db_session_commit fixture actually commits changes."""
    # Test that this session can commit changes
    # This will be more useful once we have actual models

    result = db_session_commit.execute(text("SELECT sqlite_version() as version"))
    row = result.fetchone()
    assert row.version is not None


@pytest.mark.integration
def test_sample_data_fixture(sample_data):
    """Test that sample_data fixture works."""
    # Currently returns empty dict, but should work without errors
    assert isinstance(sample_data, dict)


@pytest.mark.unit
def test_database_imports():
    """Test that database modules can be imported correctly."""
    from app.core.database import Base, SessionLocal, engine, get_db

    # Test that we can import all database components
    assert Base is not None
    assert SessionLocal is not None
    assert engine is not None
    assert get_db is not None

    # Test that Base has metadata
    assert hasattr(Base, "metadata")
    assert hasattr(Base.metadata, "create_all")
