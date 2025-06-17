"""
Database configuration and session management for UnderdogDevs backend.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# Create sync database engines for backward compatibility
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG,
)

test_engine = create_engine(
    settings.TEST_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG,
)

# Create async database engines
async_engine = create_async_engine(
    settings.DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://"),
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG,
)

async_test_engine = create_async_engine(
    settings.TEST_DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://"),
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG,
)

# Create session makers
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create async session makers
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
)

AsyncTestSessionLocal = async_sessionmaker(
    bind=async_test_engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
)

# Create declarative base for models
Base = declarative_base()

# Models will be registered when imported
# This happens automatically when the models modules are imported


def get_db():
    """
    Dependency function to get sync database session.
    Used by FastAPI dependency injection for backward compatibility.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_db_session():
    """
    Dependency function to get async database session.
    Used by FastAPI dependency injection for async operations.
    """
    async with AsyncSessionLocal() as session:
        yield session


def get_test_db():
    """
    Get sync test database session.
    Used in test fixtures for backward compatibility.
    """
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_test_db_session():
    """
    Get async test database session.
    Used in async test fixtures.
    """
    async with AsyncTestSessionLocal() as session:
        yield session
