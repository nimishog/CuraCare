from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import gemini_service

router = APIRouter()

class IntakeRequest(BaseModel):
    raw_transcript: str

@router.post("/structure", summary="Structure Patient Transcript via Gemini")
async def structure_intake(payload: IntakeRequest):
    if not payload.raw_transcript.strip():
        raise HTTPException(status_code=400, detail="Raw transcript cannot be empty.")
    
    structured_data = await gemini_service.structure_patient_intake(payload.raw_transcript)
    return {"status": "success", "structured_data": structured_data}