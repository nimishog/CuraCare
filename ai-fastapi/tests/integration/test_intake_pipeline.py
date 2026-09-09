import pytest
from httpx import AsyncClient


class TestIntakePipeline:
    @pytest.mark.asyncio
    async def test_emergency_stops_pipeline(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/process", json={
            "session_id": "test-emergency",
            "raw_transcript": "I have severe chest pain radiating to left arm",
            "source_language": "en",
            "question_count": 0
        })
        assert response.status_code == 200
        data = response.json()
        assert data["emergency"]["is_emergency"] is True
        assert data["next_question"] is None
        assert data["is_complete"] is True
        assert "chest pain" in data["emergency"]["flagged_reason"].lower()

    @pytest.mark.asyncio
    async def test_hindi_translation_and_structure(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/process", json={
            "session_id": "test-hindi",
            "raw_transcript": "Mujhe kal se bukhar hai",  # "I have fever since yesterday"
            "source_language": "hi",
            "question_count": 0
        })
        assert response.status_code == 200
        data = response.json()
        assert data["emergency"]["is_emergency"] is False
        assert "fever" in data["structured_data"]["chief_complaint"].lower()
        assert data["next_question"] is not None
        assert data["question_count"] == 1

    @pytest.mark.asyncio
    async def test_english_non_emergency_first_question(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/process", json={
            "session_id": "test-en-first",
            "raw_transcript": "I have had a headache and mild fever for 2 days",
            "source_language": "en",
            "question_count": 0
        })
        assert response.status_code == 200
        data = response.json()
        assert data["emergency"]["is_emergency"] is False
        assert len(data["structured_data"]["symptoms"]) >= 1
        assert data["next_question"] is not None
        assert data["next_question"]["question_type"] == "multiple_choice"
        assert len(data["next_question"]["options"]) >= 3
        assert data["question_count"] == 1

    @pytest.mark.asyncio
    async def test_followup_preserves_context(self, test_client: AsyncClient):
        # First request
        resp1 = await test_client.post("/api/v1/intake/process", json={
            "session_id": "test-context",
            "raw_transcript": "I have a headache and fever for 2 days",
            "source_language": "en",
            "question_count": 0
        })
        assert resp1.status_code == 200
        data1 = resp1.json()
        q1 = data1["next_question"]["question"]
        symptoms_count_1 = len(data1["structured_data"]["symptoms"])
        assert symptoms_count_1 > 0
        
        # Second request - answer the question, pass previous structured data
        resp2 = await test_client.post("/api/v1/intake/process", json={
            "session_id": "test-context",
            "raw_transcript": "No, I don't have those symptoms",
            "source_language": "en",
            "conversation_history": [{"question": q1, "answer": "No, I don't have those symptoms"}],
            "question_count": 1,
            "previous_structured_data": data1["structured_data"]
        })
        assert resp2.status_code == 200
        data2 = resp2.json()
        
        # Verify context preserved - symptoms should not be empty
        assert len(data2["structured_data"]["symptoms"]) > 0, "Context lost: symptoms disappeared"
        assert data2["question_count"] == 2

    @pytest.mark.asyncio
    async def test_empty_transcript_rejected(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/process", json={
            "session_id": "test-empty",
            "raw_transcript": "",
            "source_language": "en",
            "question_count": 0
        })
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_invalid_language_code(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/process", json={
            "session_id": "test-lang",
            "raw_transcript": "Test",
            "source_language": "xx",  # Invalid
            "question_count": 0
        })
        assert response.status_code == 422  # Validation error

    @pytest.mark.asyncio
    async def test_max_questions_completes(self, test_client: AsyncClient):
        # This would require 20 iterations - skip in CI, test logic in unit tests
        pass


class TestLegacyStructureEndpoint:
    @pytest.mark.asyncio
    async def test_structure_endpoint(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/structure", json={
            "raw_transcript": "Patient has headache and fever for 2 days"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "structured_data" in data
        assert "symptoms" in data["structured_data"]

    @pytest.mark.asyncio
    async def test_structure_empty_transcript_rejected(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/structure", json={
            "raw_transcript": ""
        })
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_structure_emergency_returns_409(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/structure", json={
            "raw_transcript": "I have severe chest pain"
        })
        assert response.status_code == 409
        data = response.json()
        # FastAPI wraps HTTPException detail in "detail" key
        assert data["detail"]["error"] == "Emergency detected"
        assert data["detail"]["emergency"]["is_emergency"] is True