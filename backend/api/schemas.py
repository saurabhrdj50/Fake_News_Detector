"""
Pydantic Models for API Request/Response validation
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional


class PredictionRequest(BaseModel):
    """Request model for prediction endpoint"""
    text: str = Field(..., min_length=10, max_length=5000, description="News article text")
    
    @field_validator("text")
    def text_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Text cannot be empty or only whitespace")
        return v


class PredictionResponse(BaseModel):
    """Response model for prediction endpoint"""
    label: str = Field(..., description="Prediction label: FAKE or REAL")
    confidence: float = Field(..., ge=0, le=100, description="Confidence percentage")
    prob_fake: float = Field(..., ge=0, le=100, description="Probability of being fake")
    prob_real: float = Field(..., ge=0, le=100, description="Probability of being real")
    original_length: int = Field(..., description="Length of original text")
    cleaned_length: int = Field(..., description="Length of cleaned text")


class BatchPredictionRequest(BaseModel):
    """Request model for batch prediction"""
    texts: list[str] = Field(..., min_items=1, max_items=100, description="List of texts")


class BatchPredictionResponse(BaseModel):
    """Response model for batch prediction"""
    predictions: list[dict]
    total_processed: int
    errors: int


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_ready: bool
    version: str


class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    detail: Optional[str] = None
    code: int


class EnhancedPredictionRequest(BaseModel):
    """Request model for enhanced prediction with Gemini AI"""
    text: str = Field(..., min_length=10, max_length=5000, description="News article text")
    use_gemini: bool = Field(default=True, description="Whether to use Gemini AI for detailed analysis")
    
    @field_validator("text")
    def text_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Text cannot be empty or only whitespace")
        return v


class GeminiAnalysisResponse(BaseModel):
    """Gemini AI analysis response"""
    is_fake: bool = Field(..., description="Whether Gemini thinks the news is fake")
    confidence: float = Field(..., ge=0, le=100, description="Gemini confidence score")
    explanation: str = Field(..., description="Detailed explanation from Gemini")
    red_flags: list[str] = Field(default_factory=list, description="Red flags identified")
    supporting_evidence: list[str] = Field(default_factory=list, description="Credible elements found")
    verdict: str = Field(..., description="Final verdict statement")


class EnhancedPredictionResponse(BaseModel):
    """Enhanced prediction response with Gemini analysis"""
    label: str = Field(..., description="Prediction label: FAKE or REAL")
    confidence: float = Field(..., ge=0, le=100, description="LSTM model confidence")
    prob_fake: float = Field(..., ge=0, le=100)
    prob_real: float = Field(..., ge=0, le=100)
    original_length: int
    cleaned_length: int
    gemini_analysis: Optional[GeminiAnalysisResponse] = Field(default=None, description="Gemini AI detailed analysis")
    gemini_available: bool = Field(..., description="Whether Gemini is available")
