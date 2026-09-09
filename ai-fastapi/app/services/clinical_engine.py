import logging
from app.schemas.common import EmergencyResult

logger = logging.getLogger(__name__)


class ClinicalEngine:
    def __init__(self):
        # Define critical keywords for emergency escalation
        self.critical_keywords = [
            "chest pain", "difficulty breathing", "shortness of breath", "unconscious",
            "severe bleeding", "stroke", "sudden paralysis", "suicidal", "suicide",
            "heart attack", "cardiac arrest", "anaphylaxis", "severe allergic reaction",
            "coughing blood", "vomiting blood", "severe abdominal pain", "high fever with rash"
        ]

    def evaluate_emergency(self, transcript: str) -> EmergencyResult:
        """
        Scans the transcript for red-flag emergency symptoms.
        Returns EmergencyResult with is_emergency flag and details.
        """
        transcript_lower = transcript.lower()
        triggered_keywords = [keyword for keyword in self.critical_keywords if keyword in transcript_lower]

        if triggered_keywords:
            logger.warning(f"EMERGENCY DETECTED: {triggered_keywords}")
            return EmergencyResult(
                is_emergency=True,
                flagged_reason=f"Critical symptoms detected: {', '.join(triggered_keywords)}",
                action="STOP automated intake, alert hospital staff via Firebase, initiate human assessment."
            )
        
        return EmergencyResult(
            is_emergency=False,
            flagged_reason=None,
            action="Proceed with normal clinical handoff."
        )


clinical_engine = ClinicalEngine()