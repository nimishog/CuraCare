import os
from groq import Groq
from fastapi import UploadFile, HTTPException
from app.core.config import settings

class AudioService:
    def __init__(self):
        # Initialize the Groq client using the API key from config
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    async def transcribe_audio(self, file: UploadFile) -> str:
        """
        Sends patient audio from the kiosk to Groq for ultra-low latency speech-to-text transcription.
        """
        try:
            # Read file contents into memory temporarily
            audio_content = await file.read()
            
            # Save temporarily or pass file-like object depending on Groq SDK requirements
            temp_file_path = f"temp_{file.filename}"
            with open(temp_file_path, "wb") as f:
                f.write(audio_content)

            with open(temp_file_path, "rb") as audio_file:
                # Call Groq's Whisper-equivalent transcription endpoint
                completion = self.client.audio.transcriptions.create(
                    file=(file.filename, audio_file.read()),
                    model="whisper-large-v3", # Groq hosts high-speed whisper models
                    response_format="json"
                )
            
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

            return completion.text

        except Exception as e:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            raise HTTPException(status_code=500, detail=f"Groq Transcription Failed: {str(e)}")

audio_service = AudioService()