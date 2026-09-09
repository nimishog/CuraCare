from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.audio_service import audio_service
from app.schemas.audio import TranscriptionResponse
from app.core.config import settings

router = APIRouter()


@router.post("/transcribe", response_model=TranscriptionResponse, summary="Patient Speech to Text via Groq")
async def transcribe_patient_speech(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(('.mp3', '.wav', '.m4a', '.webm', '.ogg')):
        raise HTTPException(status_code=400, detail="Invalid audio file format. Supported: mp3, wav, m4a, webm, ogg")
    
    # Check file size (read first chunk to estimate)
    # Note: full validation happens in service after reading full file
    transcript = await audio_service.transcribe_audio(file)
    return TranscriptionResponse(raw_transcript=transcript)