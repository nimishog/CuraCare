import pytest
from app.schemas.intake import (
    Symptom, StructuredIntakeOutput, 
    IntakeProcessRequest, IntakeProcessResponse,
    IntakeRequest, IntakeResponse
)
from app.schemas.common import (
    LanguageCode, EmergencyResult, QA, 
    QuestionType, QuestionResponse
)
from app.schemas.audio import TranscriptionResponse
from app.schemas.vision import OCRResponse


class TestSchemas:
    def test_symptom_creation(self):
        s = Symptom(name="headache", duration="2 days", severity="moderate", body_location="head")
        assert s.name == "headache"
        assert s.severity == "moderate"

    def test_symptom_severity_validation(self):
        with pytest.raises(ValueError):
            Symptom(name="test", duration="1 day", severity="invalid")

    def test_structured_intake_output(self):
        data = StructuredIntakeOutput(
            symptoms=[Symptom(name="fever", duration="1 day", severity="mild")],
            chief_complaint="Fever",
            history_present_illness="Patient has fever",
            clinical_summary="Summary"
        )
        assert len(data.symptoms) == 1
        assert data.chief_complaint == "Fever"

    def test_intake_process_request_defaults(self):
        req = IntakeProcessRequest(
            session_id="test-1",
            raw_transcript="I have a headache",
            source_language=LanguageCode.EN
        )
        assert req.question_count == 0
        assert req.conversation_history == []
        assert req.previous_structured_data is None

    def test_intake_process_request_with_context(self):
        prev = StructuredIntakeOutput(
            symptoms=[Symptom(name="headache", duration="2 days", severity="moderate")],
            chief_complaint="Headache",
            history_present_illness="Patient has headache",
            clinical_summary="Summary"
        )
        req = IntakeProcessRequest(
            session_id="test-1",
            raw_transcript="No other symptoms",
            source_language=LanguageCode.EN,
            question_count=1,
            conversation_history=[QA(question="Q1", answer="A1")],
            previous_structured_data=prev
        )
        assert req.question_count == 1
        assert len(req.conversation_history) == 1
        assert req.previous_structured_data == prev

    def test_emergency_result(self):
        er = EmergencyResult(is_emergency=True, flagged_reason="Chest pain", action="Stop")
        assert er.is_emergency is True

    def test_question_response(self):
        qr = QuestionResponse(
            question="How are you?",
            question_type=QuestionType.MULTIPLE_CHOICE,
            options=["Good", "Bad"]
        )
        assert qr.question_type == QuestionType.MULTIPLE_CHOICE

    def test_language_code_enum(self):
        assert LanguageCode.HI == "hi"
        assert LanguageCode.BN == "bn"

    def test_audio_response(self):
        resp = TranscriptionResponse(raw_transcript="Hello world")
        assert resp.status == "success"
        assert resp.raw_transcript == "Hello world"

    def test_vision_response(self):
        resp = OCRResponse(extracted_text="Paracetamol 500mg")
        assert resp.status == "success"
        assert "Paracetamol" in resp.extracted_text

    def test_legacy_intake_request(self):
        req = IntakeRequest(raw_transcript="Test")
        assert req.raw_transcript == "Test"

    def test_legacy_intake_response(self):
        resp = IntakeResponse(structured_data={"key": "value"})
        assert resp.status == "success"