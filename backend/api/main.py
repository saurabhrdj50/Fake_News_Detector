"""
FastAPI Application and Route Definitions
Main backend server for Fake News Detection
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import Optional
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.config.settings import app_config
from backend.utils.logger import logger
from backend.services.model_service import get_model_service
from backend.utils.text_processor import get_preprocessor
from backend.api.schemas import (
    PredictionRequest,
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    HealthResponse,
    ErrorResponse,
    EnhancedPredictionRequest,
    EnhancedPredictionResponse,
    GeminiAnalysisResponse
)
from backend.services.gemini_service import get_gemini_service

# Initialize FastAPI app
app = FastAPI(
    title=app_config.APP_NAME,
    version=app_config.APP_VERSION,
    description="Advanced Fake News Detection using Deep Learning",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# HEALTH CHECK ENDPOINTS
# ============================================================================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint
    Returns application and model status
    """
    model_service = get_model_service()
    return HealthResponse(
        status="healthy",
        model_ready=model_service.is_ready,
        version=app_config.APP_VERSION
    )


@app.get("/api/v1/health", response_model=HealthResponse, tags=["Health"])
async def api_health():
    """API v1 health endpoint"""
    return await health_check()


# ============================================================================
# PREDICTION ENDPOINTS
# ============================================================================

@app.post(
    "/api/v1/predict",
    response_model=PredictionResponse,
    tags=["Predictions"],
    summary="Predict single article"
)
async def predict(request: PredictionRequest):
    """
    Predict whether a news article is fake or real
    
    **Parameters:**
    - `text`: The news article text (10-5000 characters)
    
    **Returns:**
    - `label`: FAKE or REAL
    - `confidence`: Prediction confidence (0-100%)
    - `prob_fake`: Probability of being fake
    - `prob_real`: Probability of being real
    - `original_length`: Length of input text
    - `cleaned_length`: Length after preprocessing
    """
    try:
        logger.info(f"Prediction request: {len(request.text)} characters")
        
        # Get services
        model_service = get_model_service()
        preprocessor = get_preprocessor()
        
        # Validate model is ready
        if not model_service.is_ready:
            logger.error("Model not loaded")
            raise HTTPException(
                status_code=503,
                detail="Model service is not ready. Please try again later."
            )
        
        # Validate input
        is_valid, error_msg = preprocessor.validate_text(request.text)
        if not is_valid:
            logger.warning(f"Validation failed: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Get prediction
        label, confidence, prob_fake, prob_real = model_service.predict(request.text)
        
        # Get cleaned text length
        cleaned = preprocessor.clean_text(request.text)
        
        return PredictionResponse(
            label=label,
            confidence=round(confidence, 2),
            prob_fake=round(prob_fake, 2),
            prob_real=round(prob_real, 2),
            original_length=len(request.text),
            cleaned_length=len(cleaned),
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error during prediction"
        )


@app.post(
    "/api/v1/enhanced-predict",
    response_model=EnhancedPredictionResponse,
    tags=["Predictions"],
    summary="Enhanced prediction with Gemini AI"
)
async def enhanced_predict(request: EnhancedPredictionRequest):
    """
    Predict whether a news article is fake or real with optional Gemini AI analysis
    
    **Parameters:**
    - `text`: The news article text (10-5000 characters)
    - `use_gemini`: Whether to use Gemini AI for detailed analysis (default: true)
    
    **Returns:**
    - `label`: FAKE or REAL
    - `confidence`: LSTM model confidence (0-100%)
    - `prob_fake`: Probability of being fake
    - `prob_real`: Probability of being real
    - `gemini_analysis`: Detailed AI analysis (if available and requested)
    - `gemini_available`: Whether Gemini is configured
    """
    try:
        logger.info(f"Enhanced prediction request: {len(request.text)} chars, use_gemini={request.use_gemini}")
        
        model_service = get_model_service()
        preprocessor = get_preprocessor()
        
        if not model_service.is_ready:
            raise HTTPException(
                status_code=503,
                detail="Model service is not ready. Please try again later."
            )
        
        is_valid, error_msg = preprocessor.validate_text(request.text)
        if not is_valid:
            logger.warning(f"Validation failed: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)
        
        label, confidence, prob_fake, prob_real = model_service.predict(request.text)
        cleaned = preprocessor.clean_text(request.text)
        
        gemini_analysis = None
        gemini_available = False
        
        if request.use_gemini:
            gemini_service = get_gemini_service()
            gemini_available = gemini_service.is_available
            
            if gemini_available:
                logger.info("Getting Gemini AI analysis...")
                gemini_result = await gemini_service.analyze_news(request.text)
                
                if gemini_result:
                    gemini_analysis = GeminiAnalysisResponse(
                        is_fake=gemini_result.is_fake,
                        confidence=gemini_result.confidence,
                        explanation=gemini_result.explanation,
                        red_flags=gemini_result.red_flags,
                        supporting_evidence=gemini_result.supporting_evidence,
                        verdict=gemini_result.verdict
                    )
                    logger.info(f"Gemini analysis complete: {gemini_result.verdict}")
        
        return EnhancedPredictionResponse(
            label=label,
            confidence=round(confidence, 2),
            prob_fake=round(prob_fake, 2),
            prob_real=round(prob_real, 2),
            original_length=len(request.text),
            cleaned_length=len(cleaned),
            gemini_analysis=gemini_analysis,
            gemini_available=gemini_available
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Enhanced prediction error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error during enhanced prediction"
        )


@app.post(
    "/api/v1/batch-predict",
    response_model=BatchPredictionResponse,
    tags=["Predictions"],
    summary="Predict multiple articles"
)
async def batch_predict(request: BatchPredictionRequest):
    """
    Predict multiple news articles at once
    
    **Parameters:**
    - `texts`: List of news article texts (max 100 items)
    
    **Returns:**
    - `predictions`: List of predictions
    - `total_processed`: Number of articles processed
    - `errors`: Number of processing errors
    """
    try:
        logger.info(f"Batch prediction request: {len(request.texts)} articles")
        
        model_service = get_model_service()
        
        if not model_service.is_ready:
            raise HTTPException(
                status_code=503,
                detail="Model service is not ready"
            )
        
        predictions = model_service.batch_predict(request.texts)
        errors = sum(1 for p in predictions if "error" in p)
        
        return BatchPredictionResponse(
            predictions=predictions,
            total_processed=len(request.texts),
            errors=errors
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Internal server error during batch prediction"
        )


# ============================================================================
# INFO ENDPOINTS
# ============================================================================

@app.get("/api/v1/info", tags=["Info"])
async def get_info():
    """Get application information"""
    return {
        "name": app_config.APP_NAME,
        "version": app_config.APP_VERSION,
        "max_input_length": app_config.MAX_INPUT_LENGTH,
        "min_input_length": app_config.MIN_INPUT_LENGTH,
        "model_threshold": 0.5,
        "features": [
            "Single article prediction",
            "Batch prediction",
            "Confidence scoring",
            "Text preprocessing"
        ]
    }


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle unexpected exceptions"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )


# ============================================================================
# STARTUP AND SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info(f"Starting {app_config.APP_NAME} v{app_config.APP_VERSION}")
    try:
        # Don't load model at startup - load lazily on first request
        # This prevents blocking the server start
        logger.info("Model service will be initialized on first request")
    except Exception as e:
        logger.error(f"Startup warning: {str(e)}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info(f"Shutting down {app_config.APP_NAME}")


# ============================================================================
# ROOT ENDPOINT
# ============================================================================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": app_config.APP_NAME,
        "version": app_config.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "health": "/health",
            "predict": "/api/v1/predict",
            "batch_predict": "/api/v1/batch-predict",
            "info": "/api/v1/info"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=app_config.HOST,
        port=app_config.PORT,
        reload=app_config.DEBUG
    )
