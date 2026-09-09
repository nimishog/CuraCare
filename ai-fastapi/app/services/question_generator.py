from app.services.gemini_service import gemini_service
from app.schemas.intake import StructuredIntakeOutput
from app.schemas.common import QA, QuestionResponse, QuestionType


class QuestionGenerator:
    MAX_QUESTIONS = 20
    
    async def generate_next_question(
        self, 
        structured_data: StructuredIntakeOutput, 
        history: list[QA], 
        count: int
    ) -> QuestionResponse | None:
        if count >= self.MAX_QUESTIONS:
            return None
        
        # Convert to dict for the gemini service
        data_dict = structured_data.model_dump()
        
        result = await gemini_service.generate_next_question(data_dict, [qa.model_dump() for qa in history], count)
        
        if result is None:
            return None
        
        return QuestionResponse(
            question=result.get("question", ""),
            question_type=QuestionType.MULTIPLE_CHOICE,
            options=result.get("options", [])
        )


question_generator = QuestionGenerator()