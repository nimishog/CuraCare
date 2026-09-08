class ClinicalEngine:
    def __init__(self):
        # Define hardcoded critical keywords for emergency escalation
        self.critical_keywords = [
            "chest pain", "difficulty breathing", "unconscious", 
            "severe bleeding", "stroke", "sudden paralysis", "suicidal"
        ]

    def evaluate_emergency(self, transcript: str) -> dict:
        """
        Scans the raw transcript or structured data for red-flag emergency symptoms.
        """
        transcript_lower = transcript.lower()
        triggered_keywords = [keyword for keyword in self.critical_keywords if keyword in transcript_lower]

        if triggered_keywords:
            return {
                "is_emergency": True,
                "flagged_reason": f"Critical symptoms detected: {', '.join(triggered_keywords)}",
                "action": "STOP automated intake, alert hospital staff via Firebase, initiate human assessment."
            }
        
        return {
            "is_emergency": False,
            "flagged_reason": None,
            "action": "Proceed with normal clinical handoff."
        }

clinical_engine = ClinicalEngine()