from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CuraCare AI Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    EXPRESS_BACKEND_URL: str = "http://localhost:5000" # Update this to your Express port later
    
    # Add your API Key variables here
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()