import logging
from app.services.translation_service import translation_service
from app.services.clinical_engine import clinical_engine
from app.services.gemini_service import gemini_service
from app.services.question_generator import question_generator
from app.schemas.intake import (
    IntakeProcessRequest, IntakeProcessResponse, 
    StructuredIntakeOutput
)
from app.schemas.common import EmergencyResult

logger = logging.getLogger(__name__)


class ClinicalPipeline:
    async def process_intake(self, request: IntakeProcessRequest) -> IntakeProcessResponse:
        logger.info(f"Processing intake for session {request.session_id}, question {request.question_count}")
        
        # 1. Translate
        english_text = await translation_service.translate_to_english(
            request.raw_transcript, request.source_language.value
        )
        logger.debug(f"Translated text: {english_text[:100]}...")
        
        # 2. Emergency check
        emergency = clinical_engine.evaluate_emergency(english_text)
        if emergency.is_emergency:
            logger.warning(f"Emergency triggered for session {request.session_id}: {emergency.flagged_reason}")
            minimal_structured = StructuredIntakeOutput(
                symptoms=[],
                chief_complaint="Emergency intake - automated assessment stopped",
                history_present_illness=english_text,
                clinical_summary="Emergency keywords detected. Requires immediate human assessment.",
                red_flags=[emergency.flagged_reason] if emergency.flagged_reason else [],
            )
            return IntakeProcessResponse(
                session_id=request.session_id,
                structured_data=minimal_structured,
                emergency=emergency,
                next_question=None,
                question_count=request.question_count,
                is_complete=True
            )
        
        # 3. Structure - use accumulated context if available
        if request.question_count == 0 or request.previous_structured_data is None:
            # First question or no previous context - structure from scratch
            structured_dict = await gemini_service.structure_patient_intake(english_text)
        else:
            # Follow-up question - update existing structured data with new answer
            previous_dict = request.previous_structured_data.model_dump()
            structured_dict = await gemini_service.update_structured_data(
                previous_dict, english_text, request.conversation_history
            )
        
        # Validate against StructuredIntakeOutput schema
        try:
            structured = StructuredIntakeOutput(**structured_dict)
        except Exception as e:
            logger.error(f"Structured data validation failed: {e}. Raw: {structured_dict}")
            # Fallback with minimal structure
            structured = StructuredIntakeOutput(
                symptoms=[],
                chief_complaint="Parsing error - manual review needed",
                history_present_illness=english_text,
                clinical_summary=f"Auto-structuring failed: {str(e)}",
            )
        
        # 4. Generate next question
        next_q = await question_generator.generate_next_question(
            structured, request.conversation_history, request.question_count
        )
        
        is_complete = next_q is None
        new_count = request.question_count + (1 if next_q else 0)
        
        logger.info(f"Session {request.session_id}: question_count={new_count}, complete={is_complete}")
        
        return IntakeProcessResponse(
            session_id=request.session_id,
            structured_data=structured,
            emergency=emergency,
            next_question=next_q,
            question_count=new_count,
            is_complete=is_complete
        )


clinical_pipeline = ClinicalPipeline()