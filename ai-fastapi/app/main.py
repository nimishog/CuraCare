import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Assuming these are correctly defined in your core/config.py and api/router.py
from app.core.config import settings
from app.api.router import api_router

# Configure standard Python logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """
    Lifespan context manager replacing deprecated startup/shutdown events.
    Initializes global shared resources (like HTTP clients for Groq/Gemini).
    """
    logger.info(f"Starting CuraCare AI Engine v{settings.VERSION}...")
    
    # Initialize a shared async HTTP client for external AI API calls.
    # Storing it in app.state allows services to access it via request.app.state.http_client
    app.state.http_client = httpx.AsyncClient(timeout=30.0)
    
    yield  # The FastAPI application runs while yielded
    
    # Clean up resources during shutdown
    logger.info("Shutting down CuraCare AI Engine...")
    await app.state.http_client.aclose()
    logger.info("Shared HTTP client closed successfully.")

# Initialize the FastAPI application instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Stateless AI microservice for the CuraCare intake pipeline.",
    version=settings.VERSION,
    lifespan=lifespan,
)

# Configure CORS to accept requests exclusively from the Express backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.EXPRESS_BACKEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catches all unhandled exceptions globally to prevent server crashes 
    and ensures a structured 500 JSON payload is always returned to Express.
    """
    logger.error(f"AI Pipeline Error on {request.method} {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal AI Pipeline Error", 
            "message": str(exc),
            "path": request.url.path
        },
    )

# Include all modular routes consolidated in app/api/router.py
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
async def health_check():
    """
    System health check endpoint for Docker / CI-CD orchestration.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "active_models": ["Groq", "Gemini 3.7 Flash", "Gemini Multilingual"]
    }