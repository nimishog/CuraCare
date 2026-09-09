from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "CuraCare AI Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    EXPRESS_BACKEND_URL: str  # REQUIRED - no default

    GROQ_API_KEY: str  # REQUIRED
    GEMINI_API_KEY: str  # REQUIRED

    # Model IDs
    GEMINI_TEXT_MODEL: str = "gemini-3.6-flash"
    GEMINI_TRANSLATION_MODEL: str = "gemini-3.6-flash"
    GEMINI_VISION_MODEL: str = "gemini-3.6-flash"

    # File limits
    MAX_AUDIO_SIZE_MB: int = 25
    MAX_IMAGE_SIZE_MB: int = 10

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()