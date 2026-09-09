from pydantic import BaseModel


class TranscriptionResponse(BaseModel):
    status: str = "success"
    raw_transcript: str