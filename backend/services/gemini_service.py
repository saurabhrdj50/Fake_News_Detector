"""
Gemini AI Service for Fake News Detection
Uses Google Gemini API to provide detailed analysis of news articles
"""

import os
import logging
from typing import Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class GeminiAnalysis:
    """Result from Gemini analysis"""
    is_fake: bool
    confidence: float
    explanation: str
    red_flags: list[str]
    supporting_evidence: list[str]
    verdict: str


class GeminiService:
    """Service for Gemini AI-powered news analysis"""
    
    _instance: Optional['GeminiService'] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        self._initialized = True
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        self._client = None
        
        if self.api_key:
            self._initialize_model()
        else:
            logger.warning("GEMINI_API_KEY not found in environment variables")
    
    def _initialize_model(self):
        """Initialize Gemini model"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            self._client = genai
            logger.info("Gemini model initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {e}")
            self.model = None
    
    @property
    def is_available(self) -> bool:
        """Check if Gemini is available"""
        return self.model is not None
    
    async def analyze_news(self, text: str) -> Optional[GeminiAnalysis]:
        """
        Analyze news article using Gemini AI
        
        Args:
            text: The news article text to analyze
            
        Returns:
            GeminiAnalysis with detailed findings or None if unavailable
        """
        if not self.is_available:
            logger.warning("Gemini service not available")
            return None
        
        try:
            prompt = self._build_analysis_prompt(text)
            response = self.model.generate_content(prompt)
            
            return self._parse_response(response.text, text)
            
        except Exception as e:
            logger.error(f"Gemini analysis failed: {e}")
            return None
    
    def _build_analysis_prompt(self, text: str) -> str:
        """Build prompt for Gemini analysis"""
        return f"""You are an expert fact-checker and misinformation analyst. Analyze the following news article and provide a detailed assessment.

NEWS ARTICLE:
{text}

Please respond in JSON format with the following structure:
{{
    "is_fake": true/false,
    "confidence": 0-100,
    "explanation": "Detailed explanation of why this is likely fake/real",
    "red_flags": ["List of specific suspicious elements found"],
    "supporting_evidence": ["List of credible elements or verified claims"],
    "verdict": "A clear, concise final verdict statement"
}}

Guidelines:
- Look for sensationalist language, emotional appeals, unverified claims
- Check for logical fallacies, conspiracy theories, misleading statistics
- Identify credible sources, verifiable facts, balanced reporting
- Consider the overall tone and intent of the article
- Be thorough but fair in your assessment

Return ONLY the JSON object, no other text."""
    
    def _parse_response(self, response_text: str, original_text: str) -> Optional[GeminiAnalysis]:
        """Parse Gemini response into structured data"""
        try:
            import json
            
            json_str = response_text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:]
            if json_str.startswith("```"):
                json_str = json_str[3:]
            if json_str.endswith("```"):
                json_str = json_str[:-3]
            
            data = json.loads(json_str.strip())
            
            return GeminiAnalysis(
                is_fake=data.get("is_fake", True),
                confidence=float(data.get("confidence", 50)),
                explanation=data.get("explanation", "Analysis complete"),
                red_flags=data.get("red_flags", []),
                supporting_evidence=data.get("supporting_evidence", []),
                verdict=data.get("verdict", "Unable to determine")
            )
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            logger.debug(f"Response was: {response_text[:500]}")
            return None


def get_gemini_service() -> GeminiService:
    """Get singleton instance of GeminiService"""
    return GeminiService()
