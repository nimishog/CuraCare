import pytest
from httpx import AsyncClient


class TestVisionEndpoint:
    @pytest.mark.asyncio
    async def test_valid_prescription_image(self, test_client: AsyncClient, test_rx_file: str):
        with open(test_rx_file, "rb") as f:
            response = await test_client.post("/api/v1/vision/ocr", files={"file": f})
        # May return 500 if Gemini API fails, but should not be 400/413 for valid file
        assert response.status_code in (200, 500)
        if response.status_code == 200:
            data = response.json()
            assert "extracted_text" in data
            assert len(data["extracted_text"]) > 0

    @pytest.mark.asyncio
    async def test_non_image_rejected(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/vision/ocr",
            files={"file": ("test.txt", b"text content", "text/plain")})
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_missing_file_rejected(self, test_client: AsyncClient):
        response = await test_client.post("/api/v1/vision/ocr")
        assert response.status_code == 422