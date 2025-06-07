"""
Atlas schema introspection for SQLAlchemy models.
This file imports all models so Atlas can generate the database schema.
"""

# Import the base and all models for Atlas introspection
from app.core.database import Base

# Atlas will introspect the Base.metadata to understand our schema
target_metadata = Base.metadata
