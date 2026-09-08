from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/ocr", summary="Prescription OCR via Gemini 3.7 Flash")
async def extract_prescription(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed for OCR.")
    
    extracted_text = await gemini_service.extract_prescription_text(file)
    return {"status": "success", "extracted_text": extracted_text}