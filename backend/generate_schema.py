#!/usr/bin/env python3
"""
Generate database schema from SQLAlchemy models for Atlas migrations.
This script creates the DDL statements that Atlas can use for migrations.
"""

from sqlalchemy import create_engine
from sqlalchemy.schema import CreateTable

from app.core.database import Base
from app.models.content import (  # noqa: F401
    Article,
    Post,
    Quiz,
    QuizCompletion,
    QuizQuestion,
    UserProgress,
)
from app.models.user import User, UserProfile, UserRole  # noqa: F401


def generate_create_statements():
    """Generate CREATE TABLE statements for all models."""
    # Create an in-memory SQLite engine for DDL generation
    engine = create_engine("sqlite:///:memory:")

    statements = []

    # Generate CREATE TABLE statements for each table
    for table in Base.metadata.sorted_tables:
        create_statement = CreateTable(table).compile(engine)
        statements.append(str(create_statement))

    return statements


def main():
    """Generate and print schema DDL."""
    print("-- Generated schema for UnderdogDevs backend")
    print("-- Auto-generated from SQLAlchemy models\n")

    statements = generate_create_statements()

    for statement in statements:
        print(f"{statement};\n")

    print(f"-- Total tables: {len(statements)}")


if __name__ == "__main__":
    main()
