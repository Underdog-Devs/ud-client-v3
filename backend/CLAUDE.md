# UnderdogDevs Backend - FastAPI Application

## Overview

This is the FastAPI backend for the UnderdogDevs learning platform, migrated from Next.js as part of a comprehensive refactor to separate frontend and backend concerns.

## Architecture

```
backend/
├── app/                    # Main application package
│   ├── core/              # Core configuration and utilities
│   │   ├── config.py      # Pydantic Settings v2 configuration
│   │   └── logging.py     # Structured logging setup
│   ├── api/               # API route handlers
│   ├── models/            # SQLAlchemy database models
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
- **Database**: MySQL with SQLAlchemy 2.0+ ORM
- **Authentication**: JWT with python-jose and passlib
- **Testing**: pytest with factory-boy for test data generation
- **Code Quality**: ruff for linting and formatting
- **Monitoring**: Sentry for error tracking, structlog for structured logging

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
DATABASE_URL=mysql+mysqlconnector://user:password@localhost:3306/ud_dev
TEST_DATABASE_URL=mysql+mysqlconnector://user:password@localhost:3306/ud_test
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3001,http://localhost:5173
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

### Future Endpoints (Phase 1B+)
- `/api/v1/auth/` - Authentication endpoints
- `/api/v1/users/` - User management
- `/api/v1/posts/` - Blog post management
- `/api/v1/quiz/` - Quiz system
- `/api/v1/slack/` - Slack integration

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
3. **Factory-based Test Data**: Realistic test data using factory-boy and Faker
4. **Coverage Tracking**: Comprehensive coverage reporting
5. **Environment Isolation**: Separate test configuration and database

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

## Next Steps

See `.claude/PROGRESS.md` for current migration progress and next planned features:
1. Database sessions and fixtures setup
2. Logging and monitoring configuration
3. User authentication system
4. Database models and migrations