import json
import logging
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from google import genai
from google.genai import types
from fastapi import UploadFile
from app.core.config import settings

logger = logging.getLogger(__name__)

RETRYABLE_STATUS = {503, 429, 500, 502, 504}


class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.text_model = settings.GEMINI_TEXT_MODEL
        self.translation_model = settings.GEMINI_TRANSLATION_MODEL
        self.vision_model = settings.GEMINI_VISION_MODEL

    @retry(
        wait=wait_exponential(multiplier=1, min=2, max=30),
        stop=stop_after_attempt(3),
        retry=retry_if_exception_type(Exception),
        before_sleep=lambda rs: logger.warning(f"Gemini retry {rs.attempt_number}/3")
    )
    async def _generate_with_retry(self, model: str, contents, config=None):
        response = self.client.models.generate_content(model=model, contents=contents, config=config)
        # Check for retryable status in various possible locations
        status_code = None
        if hasattr(response, '_raw_response') and hasattr(response._raw_response, 'status_code'):
            status_code = response._raw_response.status_code
        elif hasattr(response, 'status_code'):
            status_code = response.status_code
        
        if status_code in RETRYABLE_STATUS:
            raise httpx.HTTPStatusError(
                f"Status {status_code}",
                request=None, response=response._raw_response if hasattr(response, '_raw_response') else response
            )
        return response

    async def generate_text(self, prompt: str, model: str = None) -> str:
        """Generate plain text response from Gemini."""
        try:
            response = await self._generate_with_retry(model=model or self.text_model, contents=prompt)
            return response.text or ""
        except Exception as e:
            logger.error(f"Gemini text generation failed: {str(e)}")
            raise

    async def generate_json(self, prompt: str, model: str = None) -> dict:
        """Generate JSON response from Gemini with validation."""
        try:
            response = await self._generate_with_retry(
                model=model or self.text_model,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            text = response.text or "{}"
            try:
                return json.loads(text)
            except json.JSONDecodeError:
                logger.warning(f"Gemini returned invalid JSON, attempting to extract: {text[:200]}")
                import re
                match = re.search(r'```json\s*(\{.*?\})\s*```', text, re.DOTALL)
                if match:
                    return json.loads(match.group(1))
                return {"_parse_error": text[:500]}
        except Exception as e:
            logger.error(f"Gemini JSON generation failed: {str(e)}")
            raise

    async def structure_patient_intake(self, raw_transcript: str) -> dict:
        """
        Uses Gemini to extract clinical entities and structure patient data.
        Returns validated dict matching StructuredIntakeOutput schema.
        """
        prompt = f"""
You are an expert clinical assistant. Analyze the following patient intake transcript and extract structured clinical data into JSON format.
Include: symptoms, duration, severity, past medical history, medications, allergies, and potential warning signs.
Return ONLY valid JSON matching this schema:

{{
  "symptoms": [{{"name": "string", "duration": "string", "severity": "mild|moderate|severe", "body_location": "string|null"}}, ...],
  "chief_complaint": "string",
  "history_present_illness": "string",
  "past_medical_history": ["string", ...],
  "medications": ["string", ...],
  "allergies": ["string", ...],
  "red_flags": ["string", ...],
  "clinical_summary": "string",
  "suggested_specialty": "string|null"
}}

Transcript: "{raw_transcript}"
"""
        return await self.generate_json(prompt)

    async def update_structured_data(
        self, 
        previous: dict, 
        new_transcript: str, 
        history: list
    ) -> dict:
        """
        Merge new patient answer into existing structured data.
        Preserves all existing symptoms, history, medications, allergies.
        Only adds/modifies based on the new response.
        """
        prompt = f"""
You are an expert clinical assistant. Update the existing structured clinical data with new patient information.

Previous structured data:
{json.dumps(previous, indent=2)}

New patient response: "{new_transcript}"

Conversation history:
{json.dumps(history, indent=2)}

Instructions:
1. PRESERVE all existing symptoms, history_present_illness, past_medical_history, medications, allergies, red_flags
2. Only ADD or MODIFY based on the new response
3. If new response adds symptom details (duration, severity, location), update that symptom
4. If new response mentions new symptoms, add them
5. If new response mentions medications/allergies/history, add them
6. Update chief_complaint and clinical_summary if significantly changed
7. Return the COMPLETE updated JSON with the same schema

Return ONLY valid JSON matching the original schema.
"""
        return await self.generate_json(prompt)

    async def extract_prescription_text(self, file: UploadFile) -> str:
        """
        Uses Gemini multimodal vision capabilities to scan and digitize prescription images.
        """
        try:
            image_bytes = await file.read()
            
            response = await self._generate_with_retry(
                model=self.vision_model,
                contents=[
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=file.content_type or "image/jpeg",
                    ),
                    "Extract all readable text, medication names, dosages, and instructions from this prescription image accurately. Return only the extracted text."
                ]
            )
            return response.text or ""
        except Exception as e:
            logger.error(f"Gemini OCR failed: {str(e)}")
            raise

    async def translate_to_english(self, text: str, source_lang: str) -> str:
        """
        Translate text from source language to English using translation model.
        """
        if source_lang == "en":
            return text
        
        lang_names = {
            "hi": "Hindi", "bn": "Bengali", 
            "ml": "Malayalam", "ta": "Tamil"
        }
        lang_name = lang_names.get(source_lang, source_lang)
        
        prompt = f"""
Translate the following patient statement from {lang_name} to English.
Preserve all medical terminology, symptoms, durations, and clinical details exactly.
Return ONLY the English translation, no explanations.

Text: "{text}"
"""
        return await self.generate_text(prompt, model=self.translation_model)

    async def generate_next_question(self, structured_data: dict, history: list, question_count: int) -> dict | None:
        """
        Generate the next follow-up question based on current structured data and conversation history.
        Returns dict with question, question_type, and options, or None if complete.
        """
        if question_count >= 20:
            return None

        symptoms_summary = ", ".join([
            f"{s.get('name', '')} ({s.get('duration', '')}, {s.get('severity', '')})" 
            for s in structured_data.get('symptoms', [])
        ])
        
        history_text = "\n".join([
            f"Q: {qa.get('question', '')}\nA: {qa.get('answer', '')}" 
            for qa in history
        ]) if history else "No prior questions."

        prompt = f"""
You are a clinical intake assistant. Based on the patient's structured data and conversation history, generate the SINGLE most important next clinical question to ask.

Current structured data:
- Chief complaint: {structured_data.get('chief_complaint', 'Unknown')}
- Symptoms: {symptoms_summary or 'None identified'}
- History of present illness: {structured_data.get('history_present_illness', 'Not provided')}
- Past medical history: {', '.join(structured_data.get('past_medical_history', [])) or 'None'}
- Current medications: {', '.join(structured_data.get('medications', [])) or 'None'}
- Allergies: {', '.join(structured_data.get('allergies', [])) or 'None'}
- Red flags noted: {', '.join(structured_data.get('red_flags', [])) or 'None'}

Conversation history:
{history_text}

Question count so far: {question_count} / 20

Generate a follow-up question that:
1. Addresses the most critical missing clinical information
2. Is specific and actionable
3. Uses multiple-choice format with 3-5 clear options
4. Does NOT repeat already answered topics

Return ONLY valid JSON:
{{
  "question": "string",
  "question_type": "multiple_choice",
  "options": ["option1", "option2", "option3", "option4"]
}}
"""
        result = await self.generate_json(prompt)
        
        if isinstance(result, dict) and "question" in result and "options" in result:
            result.setdefault("question_type", "multiple_choice")
            return result
        
        logger.warning(f"Invalid question generation response: {result}")
        return None


gemini_service = GeminiService()