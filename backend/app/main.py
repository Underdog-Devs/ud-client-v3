"""
FastAPI application entry point for UnderdogDevs backend.
"""

from app.core.config import settings

# Simplified version for initial testing - will add FastAPI when dependencies are installed
def create_app():
    """Create and return basic app info for testing."""
    return {
        "title": "UnderdogDevs API",
        "description": "Backend API for UnderdogDevs learning platform",
        "version": "0.1.0",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
        "cors_origins": settings.CORS_ORIGINS
    }

# Placeholder app for testing
app = create_app()

def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

def root():
    """Root endpoint."""
    return {"message": "UnderdogDevs API", "version": "0.1.0"}

if __name__ == "__main__":
    print("🚀 UnderdogDevs Backend")
    print(f"📊 App Info: {app}")
    print(f"💚 Health: {health_check()}")
    print(f"🏠 Root: {root()}")
    print("\n✅ Basic structure working!")
    print("🔧 Next: Install FastAPI dependencies and create real server")
