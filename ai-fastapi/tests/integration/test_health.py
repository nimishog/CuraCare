import pytest
from httpx import AsyncClient


class TestHealthEndpoints:
    @pytest.mark.asyncio
    async def test_health_endpoint(self, test_client: AsyncClient):
        response = await test_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "CuraCare AI Engine"
        assert "active_models" in data

    @pytest.mark.asyncio
    async def test_detailed_health_endpoint(self, test_client: AsyncClient):
        response = await test_client.get("/health/detailed")
        assert response.status_code == 200
        data = response.json()
        assert "checks" in data
        assert data["checks"]["groq"] == "configured"
        assert data["checks"]["gemini"] == "configured"