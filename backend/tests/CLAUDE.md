# UnderdogDevs Backend - Test Suite

## Overview

Comprehensive test suite for the UnderdogDevs FastAPI backend using pytest, factory-boy, and FastAPI TestClient for thorough testing coverage.

## Test Structure

```
tests/
├── CLAUDE.md              # This file - test suite documentation
├── conftest.py            # Pytest configuration and shared fixtures
├── test_main.py           # FastAPI application endpoint tests
├── test_factories.py      # Factory-boy test data generation tests
└── factories/             # Test data factories
    ├── __init__.py        # Factory exports
    ├── base.py            # Base factory configuration
    └── api.py             # API-specific factories
```

## Testing Framework

### Core Technologies
- **pytest**: Primary testing framework with fixtures and markers
- **pytest-asyncio**: Async test support for FastAPI
- **pytest-cov**: Coverage reporting and analysis
- **FastAPI TestClient**: HTTP client for endpoint testing
- **factory-boy**: Test data generation with realistic fake data
- **Faker**: Realistic fake data generation

### Test Categories

Tests are organized with pytest markers:

```bash
# Run all tests
python -m pytest

# Run only unit tests (fast)
python -m pytest -m unit

# Run integration tests (slower)
python -m pytest -m integration

# Run end-to-end tests (slowest)
python -m pytest -m e2e
```

## Test Configuration

### Environment Setup
Tests automatically configure a testing environment:
- `ENVIRONMENT=testing`
- `DEBUG=True`
- Isolated from development configuration
- Automatic cleanup after tests

### Pytest Configuration (pyproject.toml)
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
markers = [
    "unit: marks tests as unit tests (fast)",
    "integration: marks tests as integration tests (slower)", 
    "e2e: marks tests as end-to-end tests (slowest)",
]
asyncio_mode = "auto"
```

## Test Data Factories

### Available Factories
Located in `tests/factories/`:

#### API Response Factories
- **APIResponseFactory**: Basic API response structure
- **HealthCheckFactory**: Health check endpoint responses
- **APIInfoFactory**: API information endpoint responses

#### User Data Factories
- **UserDataFactory**: Realistic user data with:
  - Sequential IDs
  - Fake emails, names, timestamps
  - Boolean flags and status fields

### Factory Usage Examples

```python
from tests.factories import UserDataFactory, APIResponseFactory

# Generate single user
user = UserDataFactory.build()
assert user["email"] != UserDataFactory.build()["email"]  # Unique data

# Generate API response
response = APIResponseFactory.build()
assert response["version"] == "0.1.0"
```

## Test Fixtures

### Core Fixtures (conftest.py)
- **client**: FastAPI TestClient for HTTP requests
- **app_instance**: Direct FastAPI app access for testing
- **setup_test_environment**: Automatic environment configuration

### Usage Examples

```python
def test_endpoint(client):
    """Test using FastAPI TestClient."""
    response = client.get("/api/endpoint")
    assert response.status_code == 200

def test_app_config(app_instance):
    """Test FastAPI app configuration."""
    assert app_instance.title == "UnderdogDevs API"
```

## Current Test Coverage

### Endpoint Tests (test_main.py)
- ✅ Root endpoint (`/`) response validation
- ✅ Health check endpoint (`/health`) status
- ✅ API info endpoint (`/api/info`) configuration
- ✅ FastAPI app structure and metadata
- ✅ Configuration loading and environment setup
- ✅ Package import verification

### Factory Tests (test_factories.py)
- ✅ API response factory data generation
- ✅ Health check factory structure
- ✅ API info factory completeness
- ✅ User data factory realism and uniqueness
- ✅ Factory data uniqueness across instances

### Test Statistics
- **Total Tests**: 11 (6 main + 5 factory)
- **Coverage**: 55% (will increase as features are added)
- **Pass Rate**: 100%
- **Execution Time**: <0.1s (fast test suite)

## Writing Tests

### Test Guidelines

1. **Use Descriptive Names**: `test_user_creation_validates_email_format`
2. **Test One Thing**: Each test should verify a single behavior
3. **Use Factories**: Generate test data with factories, not hardcoded values
4. **Mark Tests**: Use pytest markers (`@pytest.mark.unit`)
5. **Clean Assertions**: Clear, readable assertion messages

### Example Test Structure

```python
import pytest
from fastapi import status
from tests.factories import UserDataFactory

@pytest.mark.unit
def test_user_endpoint_returns_user_data(client):
    """Test that user endpoint returns properly formatted user data."""
    # Arrange
    expected_user = UserDataFactory.build()
    
    # Act
    response = client.get(f"/api/users/{expected_user['id']}")
    
    # Assert
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == expected_user["email"]
```

### Database Testing (Future)
When database integration is added:

```python
@pytest.mark.integration
def test_user_creation_persists_to_database(client, db_session):
    """Test that user creation saves to database."""
    user_data = UserDataFactory.build()
    
    response = client.post("/api/users", json=user_data)
    assert response.status_code == status.HTTP_201_CREATED
    
    # Verify database persistence
    saved_user = db_session.query(User).filter_by(email=user_data["email"]).first()
    assert saved_user is not None
```

## Running Tests

### Basic Test Execution
```bash
# Run all tests with verbose output
python -m pytest -v

# Run with coverage report
python -m pytest --cov=app --cov-report=term-missing

# Run specific test file
python -m pytest tests/test_main.py -v

# Run specific test function
python -m pytest tests/test_main.py::test_root_endpoint -v
```

### Coverage Analysis
```bash
# Generate HTML coverage report
python -m pytest --cov=app --cov-report=html

# View coverage in browser
open htmlcov/index.html
```

### Performance Testing
```bash
# Run tests with timing information
python -m pytest --durations=10

# Run only fast unit tests
python -m pytest -m unit --maxfail=1
```

## Future Test Additions

### Planned Test Categories

1. **Database Tests**: SQLAlchemy model and migration testing
2. **Authentication Tests**: JWT token generation and validation
3. **API Integration Tests**: End-to-end workflow testing
4. **Performance Tests**: Load testing for API endpoints
5. **Security Tests**: Input validation and injection prevention

### Database Testing Setup (Phase 1A Next)
- Test database fixtures with automatic cleanup
- Database session management for tests
- Migration testing and rollback verification
- Connection pooling and concurrent test support

## Troubleshooting

### Common Test Issues

1. **Import Errors**: Ensure virtual environment is activated
2. **Async Test Failures**: Check `pytest-asyncio` configuration
3. **Factory Errors**: Verify factory inheritance from correct base class
4. **Fixture Conflicts**: Check fixture scope and dependencies

### Debug Test Failures
```bash
# Run with detailed output
python -m pytest -vvs

# Drop into debugger on failure
python -m pytest --pdb

# Run single test with full traceback
python -m pytest tests/test_file.py::test_function -v --tb=long
```

## Integration with Development

### Pre-commit Testing
Tests should be run before every commit:
```bash
# Full test suite with linting
python -m pytest && ruff check .
```

### CI/CD Integration (Future)
Tests will be integrated into GitHub Actions:
- Run on every pull request
- Coverage reporting to external services
- Performance regression detection
- Automated dependency security scanning

## Contributing to Tests

### Adding New Tests
1. Create test file following naming convention: `test_*.py`
2. Import necessary fixtures and factories
3. Use appropriate pytest markers
4. Follow AAA pattern (Arrange, Act, Assert)
5. Ensure tests are deterministic and isolated

### Updating Factories
1. Add new factories to `tests/factories/` directory
2. Follow DictFactory pattern for API responses
3. Use Faker for realistic data generation
4. Export from `__init__.py` for easy importing
5. Add corresponding tests in `test_factories.py`

The test suite is designed to grow with the application while maintaining fast execution and comprehensive coverage.