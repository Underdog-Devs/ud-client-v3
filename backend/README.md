# UnderdogDevs Backend

FastAPI backend for the UnderdogDevs learning platform.

## Development Setup

### Prerequisites
- Python 3.11+
- Poetry
- MySQL 8.x

### Installation

1. Install dependencies:
```bash
cd backend
poetry install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Activate virtual environment:
```bash
poetry shell
```

4. Run the development server:
```bash
python -m app.main
```

The API will be available at `http://localhost:8000`

### Testing

Run tests:
```bash
pytest
```

Run tests with coverage:
```bash
pytest --cov=app --cov-report=html
```

### Code Quality

Format code:
```bash
ruff format .
```

Lint code:
```bash
ruff check .
```

## API Documentation

When running in development mode, API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── api/          # API route handlers
│   ├── core/         # Core functionality (config, logging, etc.)
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   └── tests/        # Test utilities
├── tests/            # Test files
├── scripts/          # Utility scripts
└── pyproject.toml    # Project configuration
```