import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest_asyncio.fixture
async def test_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture
def test_audio_file():
    return "tests/fixtures/test_audio.wav"


@pytest.fixture
def test_rx_file():
    return "tests/fixtures/test_prescription.jpg"


@pytest.fixture(autouse=True)
def mock_settings(monkeypatch):
    # Override settings for tests - use test keys or mock
    monkeypatch.setenv("GROQ_API_KEY", "test-groq-key")
    monkeypatch.setenv("GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setenv("EXPRESS_BACKEND_URL", "http://localhost:5000")