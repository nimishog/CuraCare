from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.gemini_service import gemini_service
from app.schemas.vision import OCRResponse
from app.core.config import settings

router = APIRouter()


@router.post("/ocr", response_model=OCRResponse, summary="Prescription OCR via Gemini")
async def extract_prescription(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed for OCR.")
    
    # Check file size
    image_bytes = await file.read()
    max_size = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
    if len(image_bytes) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"Image file too large. Max size: {settings.MAX_IMAGE_SIZE_MB}MB"
        )
    
    # Re-create upload file with the bytes we already read
    # We need to seek to beginning for the service to read again
    # But gemini_service reads the file, so we need to pass bytes directly
    # Let's modify the approach - use the bytes we already have
    
    try:
        from google.genai import types
        response = gemini_service.client.models.generate_content(
            model=gemini_service.vision_model,
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=file.content_type or "image/jpeg",
                ),
                "Extract all readable text, medication names, dosages, and instructions from this prescription image accurately. Return only the extracted text."
            ]
        )
        extracted_text = response.text or ""
        return OCRResponse(extracted_text=extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini OCR Failed: {str(e)}")