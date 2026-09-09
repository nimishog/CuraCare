from app.services.gemini_service import gemini_service


class TranslationService:
    async def translate_to_english(self, text: str, source_lang: str) -> str:
        """
        Translate text from source language to English.
        """
        return await gemini_service.translate_to_english(text, source_lang)


translation_service = TranslationService()