from pydantic import BaseModel


class OCRResponse(BaseModel):
    status: str = "success"
    extracted_text: str