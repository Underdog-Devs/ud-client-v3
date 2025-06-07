#!/usr/bin/env python3
"""
Database migration management script for UnderdogDevs backend.
This script provides convenient commands for managing Atlas migrations.
"""

import argparse
import subprocess
import sys
from pathlib import Path


def run_command(command: list[str], description: str = None) -> bool:
    """Run a shell command and return success status."""
    if description:
        print(f"🔄 {description}")

    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stderr:
            print(f"Error details: {e.stderr}")
        return False


def generate_schema():
    """Generate schema.sql from SQLAlchemy models."""
    return run_command(
        ["python", "generate_schema.py"],
        "Generating schema from SQLAlchemy models"
    )


def create_migration(name: str):
    """Create a new migration."""
    if not generate_schema():
        return False

    return run_command(
        ["atlas", "migrate", "diff", name, "--env", "local", "--to", "file://schema.sql"],
        f"Creating migration: {name}"
    )


def apply_migrations():
    """Apply pending migrations."""
    return run_command(
        ["atlas", "migrate", "apply", "--env", "local"],
        "Applying pending migrations"
    )


def migration_status():
    """Check migration status."""
    return run_command(
        ["atlas", "migrate", "status", "--env", "local"],
        "Checking migration status"
    )


def validate_migrations():
    """Validate migration files."""
    return run_command(
        ["atlas", "migrate", "validate", "--env", "local"],
        "Validating migration files"
    )


def reset_database():
    """Reset the database by removing it (development only)."""
    db_file = Path("app.db")
    if db_file.exists():
        db_file.unlink()
        print("🗑️  Removed development database")
    else:
        print("ℹ️  No database file to remove")

    return apply_migrations()


def main():
    """Main CLI interface."""
    parser = argparse.ArgumentParser(
        description="Database migration management for UnderdogDevs backend"
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Status command
    subparsers.add_parser("status", help="Check migration status")

    # Generate schema command
    subparsers.add_parser("generate", help="Generate schema.sql from models")

    # Create migration command
    create_parser = subparsers.add_parser("create", help="Create a new migration")
    create_parser.add_argument("name", help="Migration name")

    # Apply migrations command
    subparsers.add_parser("apply", help="Apply pending migrations")

    # Validate migrations command
    subparsers.add_parser("validate", help="Validate migration files")

    # Reset database command
    subparsers.add_parser("reset", help="Reset database (development only)")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    # Change to script directory
    script_dir = Path(__file__).parent.parent
    import os
    os.chdir(script_dir)

    success = True

    if args.command == "status":
        success = migration_status()
    elif args.command == "generate":
        success = generate_schema()
    elif args.command == "create":
        success = create_migration(args.name)
    elif args.command == "apply":
        success = apply_migrations()
    elif args.command == "validate":
        success = validate_migrations()
    elif args.command == "reset":
        success = reset_database()

    if success:
        print("✅ Command completed successfully")
    else:
        print("❌ Command failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
