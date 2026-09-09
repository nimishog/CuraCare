import pytest
from app.services.clinical_engine import clinical_engine
from app.schemas.common import EmergencyResult


class TestClinicalEngine:
    def test_chest_pain_triggers_emergency(self):
        result = clinical_engine.evaluate_emergency("I have severe chest pain")
        assert isinstance(result, EmergencyResult)
        assert result.is_emergency is True
        assert "chest pain" in result.flagged_reason.lower()

    def test_difficulty_breathing_triggers_emergency(self):
        result = clinical_engine.evaluate_emergency("Patient reports difficulty breathing")
        assert result.is_emergency is True
        assert "breathing" in result.flagged_reason.lower()

    def test_unconscious_triggers_emergency(self):
        result = clinical_engine.evaluate_emergency("Patient is unconscious")
        assert result.is_emergency is True

    def test_suicidal_triggers_emergency(self):
        result = clinical_engine.evaluate_emergency("Patient expresses suicidal thoughts")
        assert result.is_emergency is True

    def test_normal_symptoms_no_emergency(self):
        result = clinical_engine.evaluate_emergency("I have a headache and mild fever")
        assert result.is_emergency is False
        assert result.flagged_reason is None

    def test_multiple_keywords_detected(self):
        result = clinical_engine.evaluate_emergency("Chest pain and difficulty breathing")
        assert result.is_emergency is True
        assert "chest pain" in result.flagged_reason.lower()
        assert "breathing" in result.flagged_reason.lower()

    def test_case_insensitive(self):
        result = clinical_engine.evaluate_emergency("CHEST PAIN")
        assert result.is_emergency is True

    def test_partial_word_not_triggered(self):
        result = clinical_engine.evaluate_emergency("I have chestnut allergy")
        assert result.is_emergency is False