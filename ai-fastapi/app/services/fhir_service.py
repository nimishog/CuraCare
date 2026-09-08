class FHIRService:
    def format_to_fhir(self, patient_data: dict, structured_ai_data: dict) -> dict:
        """
        Transforms internal structured data into a standard HL7 FHIR Patient/Observation bundle.
        """
        fhir_bundle = {
            "resourceType": "Bundle",
            "type": "collection",
            "entry": [
                {
                    "resource": {
                        "resourceType": "Patient",
                        "name": [{"given": [patient_data.get("first_name")], "family": patient_data.get("last_name")}],
                        "telecom": [{"system": "phone", "value": patient_data.get("contact_number")}]
                    }
                },
                {
                    "resource": {
                        "resourceType": "ClinicalImpression",
                        "status": "completed",
                        "description": structured_ai_data.get("summary", "Automated OPD Intake"),
                        "note": [{"text": str(structured_ai_data)}]
                    }
                }
            ]
        }
        return fhir_bundle

fhir_service = FHIRService()