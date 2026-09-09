from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Literal


class LanguageCode(str, Enum):
    EN = "en"
    HI = "hi"
    BN = "bn"
    ML = "ml"
    TA = "ta"


class EmergencyResult(BaseModel):
    is_emergency: bool
    flagged_reason: Optional[str] = None
    action: str


class QA(BaseModel):
    question: str
    answer: str


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    FREE_TEXT = "free_text"


class QuestionResponse(BaseModel):
    question: str
    question_type: QuestionType
    options: Optional[List[str]] = None