# UnderdogDevs Backend - FastAPI Application

## Overview

This is the FastAPI backend for the UnderdogDevs learning platform, migrated from Next.js as part of a comprehensive refactor to separate frontend and backend concerns.

## Architecture

```
backend/
├── app/                    # Main application package
│   ├── core/              # Core configuration and utilities
│   │   ├── config.py      # Pydantic Settings v2 configuration
│   │   ├── database.py    # SQLAlchemy 2.0 database configuration
│   │   └── logging.py     # Structured logging setup
│   ├── api/               # API route handlers
│   ├── models/            # SQLAlchemy database models
│   │   └── user.py        # User, UserProfile, UserRole models
│   ├── schemas/           # Pydantic request/response schemas
│   ├── services/          # Business logic layer
│   └── main.py           # FastAPI application entry point
├── tests/                 # Test suite (see tests/CLAUDE.md)
├── venv/                  # Python virtual environment
├── pyproject.toml         # Project configuration and dependencies
└── README.md             # Project documentation
```

## Technology Stack

- **Framework**: FastAPI 0.104+ with async/await support
- **Python**: 3.13+ (compatible with 3.11+)
- **Configuration**: Pydantic Settings v2 with environment variable support
- **Database**: SQLAlchemy 2.0+ ORM (SQLite for dev/test, MySQL for production)
- **Database Tools**: Alembic for migrations, sqlalchemy-utils for testing
- **Authentication**: JWT with python-jose and passlib ✅ IMPLEMENTED
- **Testing**: pytest with factory-boy for test data generation
- **Code Quality**: ruff for linting and formatting
- **Monitoring**: Sentry for error tracking, structlog for structured logging (planned)

## Development Setup

### Prerequisites
- Python 3.11+ (3.13 recommended)
- MySQL 8.0+
- Virtual environment activated

### Installation
```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies (already installed)
pip install -r requirements.txt

# Or if using poetry
poetry install
```

### Environment Configuration
Create a `.env` file in the backend directory:
```env
ENVIRONMENT=development
DEBUG=True
DATABASE_URL=sqlite:///./app.db
TEST_DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3001,http://localhost:5173
```

**Note**: SQLite is used for development and testing. For production, switch to MySQL:
```env
DATABASE_URL=mysql+mysqlconnector://user:password@localhost:3306/ud_prod
```

### Running the Application

#### Development Server
```bash
# Run with uvicorn (recommended)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Or run directly
python app/main.py
```

#### Testing
```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app --cov-report=term-missing

# Run specific test categories
python -m pytest -m unit
python -m pytest -m integration
```

#### Code Quality
```bash
# Lint code
ruff check .

# Fix auto-fixable issues
ruff check --fix .

# Format code
ruff format .
```

## API Endpoints

### Core Endpoints
- `GET /` - Root endpoint with API information
- `GET /health` - Health check endpoint
- `GET /api/info` - Detailed API configuration info
- `GET /docs` - FastAPI interactive documentation (development only)
- `GET /redoc` - ReDoc documentation (development only)

### Authentication Endpoints ✅ IMPLEMENTED
- `POST /api/auth/register` - User registration with email and password
- `POST /api/auth/login` - User authentication returning JWT tokens
- `GET /api/auth/me` - Get current authenticated user information
- `POST /api/auth/refresh` - Refresh access token using refresh token
- `POST /api/auth/logout` - Logout current user (client-side token removal)
- `POST /api/auth/password-reset/request` - Request password reset token via email
- `POST /api/auth/password-reset/confirm` - Confirm password reset with token
- `POST /api/auth/change-password` - Change password (requires authentication)
- `GET /api/auth/health` - Authentication service health check

### Future Endpoints (Phase 5B+)
- `/api/v1/users/` - User management
- `/api/v1/posts/` - Blog post management
- `/api/v1/quiz/` - Quiz system
- `/api/v1/slack/` - Slack integration

## Database Models

### User Authentication System

The application includes a comprehensive user system with role-based access control:

#### User Model (`app.models.user.User`)
Core user authentication and account management:
```python
- id: Primary key
- email: Unique email address for login
- password_hash: Hashed password for authentication
- is_active: Account status flag
- is_verified: Email verification status
- created_at, updated_at: Timestamp tracking
- last_login: Last login timestamp
- role_id: Foreign key to UserRole (optional)
```

**Relationships:**
- `role`: Many-to-one with UserRole
- `profile`: One-to-one with UserProfile

#### UserProfile Model (`app.models.user.UserProfile`)
Extended user information and social profiles:
```python
- id: Primary key
- user_id: Foreign key to User (unique, CASCADE delete)
- first_name, last_name: Personal information
- bio: User biography/description
- location: Geographic location
- website: Personal website URL
- github_username: GitHub profile
- linkedin_url: LinkedIn profile URL
- avatar_url: Profile picture URL
- timezone: User's timezone
- created_at, updated_at: Timestamp tracking
```

**Properties:**
- `full_name`: Computed property combining first_name + last_name

**Relationships:**
- `user`: One-to-one with User

#### UserRole Model (`app.models.user.UserRole`)
Role-based access control system:
```python
- id: Primary key
- name: Unique role name (e.g., "mentor", "student", "admin")
- description: Role description
- created_at: Creation timestamp
```

**Relationships:**
- `users`: One-to-many with User

### Content Models

The application includes comprehensive content management models:

#### Post Model (`app.models.content.Post`)
Blog post content management:
```python
- id: Primary key
- title: Post title (255 chars)
- slug: URL-friendly slug (unique)
- content: Full post content (Text)
- excerpt: Brief description
- image_url: Featured image URL
- published: Publication status
- featured: Featured post flag
- view_count: Page view tracking
- author_id: Foreign key to User
- published_at: Publication timestamp
- created_at, updated_at: Timestamp tracking
```

#### Quiz System Models (`app.models.content.Quiz`, `QuizQuestion`)
Educational quiz functionality:
```python
Quiz:
- id, title, slug: Basic identification
- description: Quiz description
- is_active: Active status
- passing_score: Minimum score to pass (default 70)
- time_limit_minutes: Optional time limit
- max_attempts: Optional attempt limit
- created_by_id: Foreign key to User (creator)

QuizQuestion:
- id, quiz_id: Question identification
- question_text: The question content
- question_type: Type (default "multiple_choice")
- options: JSON string of answer options
- correct_answer: The correct answer
- explanation: Answer explanation
- points: Question point value (default 1)
- order_index: Question ordering
```

#### Article Model (`app.models.content.Article`)
Documentation and learning resource management:
```python
- id, title, slug: Basic identification
- content: Full article content
- summary: Brief article summary
- category: Article category
- tags: Comma-separated tag list
- published: Publication status
- order_index: Ordering for sequences
- author_id: Foreign key to User
```

#### Progress Tracking Models (`UserProgress`, `QuizCompletion`)
User learning progress and achievement tracking:
```python
UserProgress (one per user):
- total_quizzes_completed, total_quizzes_passed: Quiz statistics
- total_articles_read: Reading progress
- current_streak_days, longest_streak_days: Engagement tracking
- total_points, level: Gamification elements
- last_activity_date: Activity tracking

QuizCompletion (per quiz attempt):
- score, total_questions, correct_answers: Performance metrics
- time_spent_minutes: Time tracking
- passed: Pass/fail status
- attempt_number: Attempt tracking
- completed_at: Completion timestamp
```

### Database Features

- **Modern SQLAlchemy 2.0**: Uses latest ORM features and syntax
- **Type Safety**: Full Python type hints with `Mapped[type]` annotations
- **Timezone Aware**: Uses `datetime.UTC` for consistent datetime handling
- **Cascade Deletion**: UserProfile automatically deleted when User is deleted, QuizQuestions cascade with Quiz deletion
- **Unique Constraints**: Email uniqueness, role name uniqueness, slug uniqueness, one profile per user, one progress per user
- **Relationship Integrity**: Proper foreign key constraints and bidirectional relationships
- **Content Relationships**: Full relationship mapping between users and all content types

### Database Configuration

- **Development**: SQLite for local development and testing
- **Production**: MySQL with connection pooling and optimization
- **Session Management**: Dependency injection for database sessions
- **Connection Pooling**: Pre-ping and connection recycling for reliability

## Configuration Management

The application uses Pydantic Settings v2 for configuration management:

- **Environment-based**: Loads from `.env` files and environment variables
- **Type validation**: Automatic type checking and conversion
- **Documentation**: Built-in field descriptions and validation
- **Defaults**: Sensible defaults for all settings

Key configuration sections:
- **Environment**: `ENVIRONMENT`, `DEBUG`
- **Database**: `DATABASE_URL`, `TEST_DATABASE_URL`
- **Authentication**: `SECRET_KEY`, `ALGORITHM`, token expiration
- **CORS**: `CORS_ORIGINS` for frontend integration
- **External Services**: Slack, AWS S3, Sentry, Strapi

## Testing Strategy

The backend uses a comprehensive testing approach:

1. **Unit Tests**: Fast tests for individual functions and classes
2. **Integration Tests**: Tests for API endpoints and database interactions
3. **Database Testing**: Comprehensive fixtures for session management and cleanup
4. **Factory-based Test Data**: Realistic test data using factory-boy and Faker
5. **Coverage Tracking**: Comprehensive coverage reporting
6. **Environment Isolation**: Separate test configuration and database

### Database Test Fixtures
- `test_db_engine`: Session-scoped database engine for test isolation
- `db_session`: Function-scoped database session with automatic rollback
- `db_session_commit`: Database session that commits changes for integration tests
- `clean_db`: Fixture that completely cleans database state between tests
- `client_with_db`: FastAPI TestClient with database dependency injection

### Current Test Coverage
- **Total Tests**: 67 tests (100% passing)
  - 6 FastAPI endpoint tests
  - 5 factory data generation tests  
  - 6 database fixture tests
  - 15 SQLAlchemy user model integration tests
  - 19 SQLAlchemy content model integration tests
  - 16 model factory tests
- **Coverage**: Comprehensive coverage of all implemented features
- **Code Quality**: Zero linting errors, modern Python standards
- **Execution Time**: <0.5s (fast test suite)

## Migration Context

This backend is part of a larger migration from Next.js to React + FastAPI:

- **Previous**: Next.js 14 with App Router (monolithic)
- **Current**: FastAPI backend + React frontend (microservices)
- **Database Migration**: Supabase → MySQL with SQLAlchemy
- **Authentication**: Custom JWT implementation
- **Deployment**: Budget-conscious approach (~$25-50/month)

## Development Guidelines

### Code Style
- Use ruff for consistent formatting and linting
- Follow PEP 8 standards with 88-character line length
- Use type hints for all function parameters and return values
- Prefer async/await for all I/O operations

### Testing Requirements
- All new features must include tests
- Maintain >80% test coverage
- Use factories for test data generation
- Test both success and error cases

### Git Workflow
- Feature branches from phase branches
- All commits must pass tests and linting
- Descriptive commit messages with context

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure virtual environment is activated
2. **Database Connection**: Verify MySQL is running and credentials are correct
3. **Port Conflicts**: Default port 8000, change if needed
4. **Environment Variables**: Check `.env` file exists and is properly formatted

### Debug Mode
Set `DEBUG=True` in environment to enable:
- Detailed error messages
- FastAPI docs at `/docs`
- Automatic code reloading
- Verbose logging

## Database Migrations

The application uses **Atlas** for modern schema management and migrations:

### Atlas Configuration
- **Local Environment**: SQLite development database
- **Test Environment**: In-memory SQLite for testing
- **Production Environment**: MySQL with environment variable configuration
- **Schema Source**: Auto-generated from SQLAlchemy models

### Migration Management
Use the convenient migration script for all database operations:

```bash
# Check migration status
python scripts/migrate.py status

# Generate schema from models  
python scripts/migrate.py generate

# Create a new migration
python scripts/migrate.py create migration_name

# Apply pending migrations
python scripts/migrate.py apply

# Validate migration files
python scripts/migrate.py validate

# Reset database (development only)
python scripts/migrate.py reset
```

### Current Schema
- **9 Tables**: Complete database schema with all relationships
- **Initial Migration**: `20250607211251_initial_schema.sql` 
- **Foreign Keys**: Proper referential integrity with CASCADE behavior
- **Indexes**: Automatic unique indexes on email, slugs, and relationships
- **Constraints**: All business logic constraints properly enforced

## Next Steps

See `.claude/PROGRESS.md` for current migration progress and next planned features:
1. ✅ Database models and migrations (COMPLETE)
2. Pydantic schemas for API validation
3. User authentication system  
4. API endpoints and business logic