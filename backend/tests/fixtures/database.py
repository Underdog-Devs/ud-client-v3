"""
Database test fixtures for UnderdogDevs backend testing.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import create_database, database_exists

from app.core.config import settings
from app.core.database import Base


@pytest.fixture(scope="session")
def test_db_engine():
    """
    Create test database engine for the entire test session.
    """
    test_url = settings.TEST_DATABASE_URL

    # Create test database if it doesn't exist
    if not database_exists(test_url):
        create_database(test_url)

    # Create engine for test database
    engine = create_engine(
        test_url,
        pool_pre_ping=True,
        echo=settings.DEBUG,
    )

    # Create all tables
    Base.metadata.create_all(bind=engine)

    yield engine

    # Cleanup: Drop all tables after tests
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture(scope="function")
def db_session(test_db_engine):
    """
    Create a database session for each test function.
    Automatically rolls back after each test.
    """
    # Create session factory
    TestSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_db_engine
    )

    # Create session
    session = TestSessionLocal()

    # Begin transaction
    transaction = session.begin()

    try:
        yield session
    finally:
        # Rollback transaction and close session
        transaction.rollback()
        session.close()


@pytest.fixture(scope="function")
def db_session_commit(test_db_engine):
    """
    Create a database session that commits changes.
    Use for integration tests that need to test actual persistence.
    """
    TestSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_db_engine
    )

    session = TestSessionLocal()

    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@pytest.fixture(scope="function")
def clean_db(test_db_engine):
    """
    Clean database fixture that truncates all tables.
    Use when you need a completely clean database state.
    """
    # Get all table names
    tables = Base.metadata.tables.keys()

    with test_db_engine.connect() as connection:
        # For SQLite, we need to delete instead of truncate
        if "sqlite" in str(test_db_engine.url):
            # SQLite approach
            for table in tables:
                connection.execute(f"DELETE FROM {table}")
        else:
            # MySQL approach
            connection.execute("SET FOREIGN_KEY_CHECKS = 0")
            for table in tables:
                connection.execute(f"TRUNCATE TABLE {table}")
            connection.execute("SET FOREIGN_KEY_CHECKS = 1")

        connection.commit()

    yield

    # Clean up after test
    with test_db_engine.connect() as connection:
        if "sqlite" in str(test_db_engine.url):
            for table in tables:
                connection.execute(f"DELETE FROM {table}")
        else:
            connection.execute("SET FOREIGN_KEY_CHECKS = 0")
            for table in tables:
                connection.execute(f"TRUNCATE TABLE {table}")
            connection.execute("SET FOREIGN_KEY_CHECKS = 1")
        connection.commit()


@pytest.fixture
def sample_data(db_session):
    """
    Create sample data for testing.
    This fixture will be expanded as models are added.
    """
    # TODO: Add sample data creation when models are implemented
    # Example:
    # user = User(email="test@example.com", name="Test User")
    # db_session.add(user)
    # db_session.commit()
    # return {"user": user}

    return {}
