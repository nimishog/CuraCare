import pytest
from unittest.mock import AsyncMock, patch
from app.services.question_generator import question_generator
from app.schemas.intake import StructuredIntakeOutput, Symptom
from app.schemas.common import QA


class TestQuestionGenerator:
    @pytest.mark.asyncio
    async def test_returns_none_at_max_questions(self):
        structured = StructuredIntakeOutput(
            symptoms=[Symptom(name="headache", duration="2 days", severity="moderate")],
            chief_complaint="Headache",
            history_present_illness="Patient has headache",
            clinical_summary="Summary"
        )
        result = await question_generator.generate_next_question(structured, [], 20)
        assert result is None

    @pytest.mark.asyncio
    async def test_generates_question_below_max(self):
        structured = StructuredIntakeOutput(
            symptoms=[Symptom(name="headache", duration="2 days", severity="moderate")],
            chief_complaint="Headache",
            history_present_illness="Patient has headache for 2 days",
            clinical_summary="Summary"
        )
        with patch('app.services.question_generator.gemini_service.generate_next_question', new_callable=AsyncMock) as mock:
            mock.return_value = {
                "question": "How severe is the pain?",
                "question_type": "multiple_choice",
                "options": ["Mild", "Moderate", "Severe"]
            }
            result = await question_generator.generate_next_question(structured, [], 0)
            assert result is not None
            assert result.question == "How severe is the pain?"
            assert len(result.options) == 3