from fastapi import APIRouter
from app.api import audio_routes, vision_routes, intake_routes

api_router = APIRouter()

api_router.include_router(audio_routes.router, prefix="/audio", tags=["Audio (Groq)"])
api_router.include_router(vision_routes.router, prefix="/vision", tags=["Vision / OCR (Gemini)"])
api_router.include_router(intake_routes.router, prefix="/intake", tags=["NLP Structuring (Gemini)"])