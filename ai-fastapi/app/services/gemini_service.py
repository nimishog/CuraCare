import os
from google import genai
from google.genai import types
from fastapi import UploadFile, HTTPException
from app.core.config import settings

class GeminiService:
    def __init__(self):
        # Initialize the official Google GenAI client
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-2.5-flash" # Use gemini-3.7-flash or equivalent available model identifier

    async def structure_patient_intake(self, raw_transcript: str) -> dict:
        """
        Uses Gemini 3.7 Flash to extract clinical entities and structure patient data.
        """
        prompt = f"""
        You are an expert clinical assistant. Analyze the following patient intake transcript and extract structured clinical data into JSON format.
        Include: symptoms, duration, severity, past medical history, and potential warning signs.
        
        Transcript: "{raw_transcript}"
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                ),
            )
            return response.text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini Structuring Failed: {str(e)}")

    async def extract_prescription_text(self, file: UploadFile) -> str:
        """
        Uses Gemini 3.7 Flash multimodal vision capabilities to scan and digitize prescription images.
        """
        try:
            image_bytes = await file.read()
            
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=[
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=file.content_type or "image/jpeg",
                    ),
                    "Extract all readable text, medication names, dosages, and instructions from this prescription image accurately."
                ]
            )
            return response.text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini OCR Failed: {str(e)}")

gemini_service = GeminiService()