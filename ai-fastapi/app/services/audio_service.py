import io
from groq import Groq
from fastapi import UploadFile, HTTPException
from app.core.config import settings


class AudioService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.max_size_bytes = settings.MAX_AUDIO_SIZE_MB * 1024 * 1024

    async def transcribe_audio(self, file: UploadFile) -> str:
        """
        Sends patient audio from the kiosk to Groq for ultra-low latency speech-to-text transcription.
        """
        try:
            # Read file contents into memory
            audio_bytes = await file.read()
            
            # Validate file size
            if len(audio_bytes) > self.max_size_bytes:
                raise HTTPException(
                    status_code=413,
                    detail=f"Audio file too large. Max size: {settings.MAX_AUDIO_SIZE_MB}MB"
                )
            
            # Validate file format
            if not file.filename or not file.filename.lower().endswith(('.mp3', '.wav', '.m4a', '.webm', '.ogg')):
                raise HTTPException(status_code=400, detail="Invalid audio file format.")

            # Pass bytes directly to Groq SDK using BytesIO - no temp files
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = file.filename  # Groq SDK uses filename for format detection

            completion = self.client.audio.transcriptions.create(
                file=(file.filename, audio_file),
                model="whisper-large-v3",
                response_format="json"
            )

            return completion.text

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Groq Transcription Failed: {str(e)}")


audio_service = AudioService()