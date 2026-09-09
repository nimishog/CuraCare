from fastapi import APIRouter, HTTPException
from app.services.clinical_pipeline import clinical_pipeline
from app.services.gemini_service import gemini_service
from app.services.clinical_engine import clinical_engine
from app.schemas.intake import (
    IntakeProcessRequest, IntakeProcessResponse,
    IntakeRequest, IntakeResponse
)
from app.schemas.common import EmergencyResult

router = APIRouter()


@router.post("/process", response_model=IntakeProcessResponse, summary="Full Intake Pipeline (Translation + Structure + Next Question)")
async def process_intake(payload: IntakeProcessRequest):
    """
    Main intake endpoint. Handles:
    1. Translation (if non-English)
    2. Emergency detection
    3. Clinical structuring
    4. Next question generation (up to 20 questions)
    """
    # Validate empty transcript early
    if not payload.raw_transcript.strip():
        raise HTTPException(status_code=400, detail="Raw transcript cannot be empty.")
    
    try:
        return await clinical_pipeline.process_intake(payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Intake processing failed: {str(e)}")


# Legacy endpoint - kept for backward compatibility
@router.post("/structure", response_model=IntakeResponse, summary="Legacy: Structure Patient Transcript Only")
async def structure_intake(payload: IntakeRequest):
    """
    Legacy endpoint: only structures the transcript.
    Does NOT translate, check emergencies, or generate questions.
    """
    if not payload.raw_transcript.strip():
        raise HTTPException(status_code=400, detail="Raw transcript cannot be empty.")
    
    try:
        # Emergency check on raw transcript
        emergency = clinical_engine.evaluate_emergency(payload.raw_transcript)
        if emergency.is_emergency:
            raise HTTPException(
                status_code=409, 
                detail={
                    "error": "Emergency detected",
                    "emergency": emergency.model_dump()
                }
            )
        
        structured_data = await gemini_service.structure_patient_intake(payload.raw_transcript)
        return IntakeResponse(structured_data=structured_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini Structuring Failed: {str(e)}")