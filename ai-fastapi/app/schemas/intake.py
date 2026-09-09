from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from .common import QA, QuestionResponse, EmergencyResult, LanguageCode


class Symptom(BaseModel):
    name: str
    duration: str
    severity: Literal["mild", "moderate", "severe"]
    body_location: Optional[str] = None


class StructuredIntakeOutput(BaseModel):
    symptoms: List[Symptom]
    chief_complaint: str
    history_present_illness: str
    past_medical_history: List[str] = []
    medications: List[str] = []
    allergies: List[str] = []
    red_flags: List[str] = []
    clinical_summary: str
    suggested_specialty: Optional[str] = None


class IntakeProcessRequest(BaseModel):
    session_id: str
    raw_transcript: str
    source_language: LanguageCode
    conversation_history: List[QA] = []
    question_count: int = 0
    previous_structured_data: Optional[StructuredIntakeOutput] = None


class IntakeProcessResponse(BaseModel):
    session_id: str
    structured_data: StructuredIntakeOutput
    emergency: EmergencyResult
    next_question: Optional[QuestionResponse] = None
    question_count: int
    is_complete: bool


# Legacy request/response for backward compatibility
class IntakeRequest(BaseModel):
    raw_transcript: str


class IntakeResponse(BaseModel):
    status: str = "success"
    structured_data: dict