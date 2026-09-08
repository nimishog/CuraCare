from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.audio_service import audio_service

router = APIRouter()

@router.post("/transcribe", summary="Patient Speech to Text via Groq")
async def transcribe_patient_speech(file: UploadFile = File(...)):
    if not file.filename.endswith(('.mp3', '.wav', '.m4a', '.webm', '.ogg')):
        raise HTTPException(status_code=400, detail="Invalid audio file format.")
    
    transcript = await audio_service.transcribe_audio(file)
    return {"status": "success", "raw_transcript": transcript}