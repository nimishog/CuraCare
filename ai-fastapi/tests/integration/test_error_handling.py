import pytest
from httpx import AsyncClient
from unittest.mock import patch


class TestErrorHandling:
    @pytest.mark.asyncio
    async def test_invalid_audio_format(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/audio/transcribe",
            files={"file": ("test.xyz", b"invalid", "application/octet-stream")})
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_invalid_image_format(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/vision/ocr",
            files={"file": ("test.pdf", b"pdf content", "application/pdf")})
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_malformed_json_request(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/process",
            content="not json", headers={"Content-Type": "application/json"})
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_missing_required_fields(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/intake/process", json={})
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_oversized_audio_rejected(self, test_client: AsyncClient):
        # Create a 26MB fake audio file
        large_audio = b"x" * (26 * 1024 * 1024)
        response = await test_client.post("/api/v1/audio/transcribe",
            files={"file": ("large.wav", large_audio, "audio/wav")})
        assert response.status_code == 413

    @pytest.mark.asyncio
    async def test_oversized_image_rejected(self, test_client: AsyncClient):
        large_image = b"x" * (11 * 1024 * 1024)
        response = await test_client.post("/api/v1/vision/ocr",
            files={"file": ("large.jpg", large_image, "image/jpeg")})
        assert response.status_code == 413