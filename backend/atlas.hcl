# Atlas configuration for UnderdogDevs backend
# Using declarative schema management with SQLAlchemy models

# Database environment configuration
env "local" {
  # Development database URL (SQLite)
  url = "sqlite://app.db"
  
  # Atlas development database for schema diffing
  dev = "sqlite://file?mode=memory&_fk=1"
  
  migration {
    # Directory where migration files will be stored
    dir = "file://migrations"
  }
}

env "test" {
  # Test database URL (SQLite in memory)
  url = "sqlite://file?mode=memory&_fk=1"
  
  dev = "sqlite://file?mode=memory&_fk=1"
  
  migration {
    dir = "file://migrations"
  }
  
  schema {
    src = "file://schema.py"
  }
}

env "production" {
  # Production database URL (will be MySQL)
  # This will be set via environment variables in production
  url = env("DATABASE_URL")
  
  dev = "mysql://root:pass@localhost:3306/atlas_dev"
  
  migration {
    dir = "file://migrations"
  }
  
  schema {
    src = "file://schema.py"
  }
}