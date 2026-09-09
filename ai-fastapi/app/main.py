import logging
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.router import api_router

# Configure standard Python logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """
    Lifespan context manager replacing deprecated startup/shutdown events.
    Initializes global shared resources (like HTTP clients for Groq/Gemini).
    """
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    
    # Initialize a shared async HTTP client for external AI API calls
    app.state.http_client = httpx.AsyncClient(timeout=30.0)
    
    yield  # The FastAPI application runs while yielded
    
    # Clean up resources during shutdown
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")
    await app.state.http_client.aclose()
    logger.info("Shared HTTP client closed successfully.")


# Initialize the FastAPI application instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Stateless AI microservice for the CuraCare intake pipeline.",
    version=settings.VERSION,
    lifespan=lifespan,
)

# Request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# Configure CORS to accept requests from Express backend and local dev
# Using regex to allow localhost on any port for development
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catches all unhandled exceptions globally to prevent server crashes 
    and ensures a structured 500 JSON payload is always returned.
    """
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"[{request_id}] AI Pipeline Error on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal AI Pipeline Error", 
            "message": str(exc),
            "path": request.url.path,
            "request_id": request_id
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
        "active_models": [
            "Groq (whisper-large-v3)",
            "Gemini Text (gemini-2.5-flash-native-audio-latest)",
            "Gemini Translation (gemini-3.5-live-translate-preview)",
            "Gemini Vision (gemini-2.5-flash-native-audio-latest)"
        ]
    }


@app.get("/health/detailed", tags=["System"])
async def detailed_health_check():
    """
    Detailed health check including external API connectivity.
    """
    import httpx
    from groq import Groq
    from google import genai
    
    checks = {}
    
    # Check Groq
    try:
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
        # Just verify client can be created
        checks["groq"] = "configured"
    except Exception as e:
        checks["groq"] = f"error: {str(e)}"
    
    # Check Gemini
    try:
        gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        checks["gemini"] = "configured"
    except Exception as e:
        checks["gemini"] = f"error: {str(e)}"
    
    # Check HTTP client
    try:
        await app.state.http_client.get("https://httpbin.org/get", timeout=5.0)
        checks["external_connectivity"] = "ok"
    except Exception as e:
        checks["external_connectivity"] = f"warning: {str(e)}"
    
    all_healthy = all("error" not in v for v in checks.values())
    
    return {
        "status": "healthy" if all_healthy else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "checks": checks
    }