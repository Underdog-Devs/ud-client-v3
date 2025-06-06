"""
Database configuration and session management for UnderdogDevs backend.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG,
)

# Create test database engine
test_engine = create_engine(
    settings.TEST_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG,
)

# Create session makers
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create declarative base for models
Base = declarative_base()


def get_db():
    """
    Dependency function to get database session.
    Used by FastAPI dependency injection.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_test_db():
    """
    Get test database session.
    Used in test fixtures.
    """
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
