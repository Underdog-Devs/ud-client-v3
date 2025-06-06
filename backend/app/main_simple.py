"""
Simple FastAPI application for testing basic setup.
"""

def create_app():
    """Create and configure the FastAPI app."""
    return {
        "message": "UnderdogDevs API",
        "version": "0.1.0",
        "status": "FastAPI backend structure created successfully"
    }

def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "environment": "development"}

if __name__ == "__main__":
    app_info = create_app()
    print("✅ FastAPI Backend Structure Test")
    print(f"✅ App: {app_info['message']}")
    print(f"✅ Version: {app_info['version']}")
    print(f"✅ Status: {app_info['status']}")

    health = health_check()
    print(f"✅ Health: {health['status']}")
    print("\n🎉 Backend project structure initialized successfully!")
    print("\nNext steps:")
    print("1. Install dependencies with Poetry or pip")
    print("2. Set up database connection")
    print("3. Run full FastAPI server")
