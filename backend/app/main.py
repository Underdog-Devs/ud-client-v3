"""
FastAPI application entry point for UnderdogDevs backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.core.config import settings

app = FastAPI(
    title="UnderdogDevs API",
    description="Backend API for UnderdogDevs learning platform",
    version="0.1.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "UnderdogDevs API",
        "version": "0.1.0",
        "environment": settings.ENVIRONMENT,
        "status": "running",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
    }


@app.get("/api/info")
async def api_info():
    """API information endpoint."""
    return {
        "title": app.title,
        "description": app.description,
        "version": app.version,
        "environment": settings.ENVIRONMENT,
        "debug_mode": settings.DEBUG,
        "docs_url": app.docs_url,
        "cors_origins": settings.CORS_ORIGINS,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
