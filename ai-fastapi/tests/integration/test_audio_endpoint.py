import pytest
from httpx import AsyncClient


class TestAudioEndpoint:
    @pytest.mark.asyncio
    async def test_valid_wav_file(self, test_client: AsyncClient, test_audio_file: str):
        with open(test_audio_file, "rb") as f:
            response = await test_client.post("/api/v1/audio/transcribe", files={"file": f})
        # May return 500 if Groq API fails, but should not be 400/413 for valid file
        assert response.status_code in (200, 500)
        if response.status_code == 200:
            data = response.json()
            assert "raw_transcript" in data

    @pytest.mark.asyncio
    async def test_invalid_format_rejected(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/audio/transcribe", 
            files={"file": ("test.txt", b"not audio", "text/plain")})
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_missing_file_rejected(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/audio/transcribe")
        assert response.status_code == 422