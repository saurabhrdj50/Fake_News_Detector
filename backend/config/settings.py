"""
Configuration Management Module
Centralized settings for the Fake News Detection application
"""

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Project root directory
PROJECT_ROOT = Path(__file__).parent.parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"

# Model paths - can be overridden by environment variables
DEFAULT_MODEL_PATH = BACKEND_DIR / "models" / "fake_news_lstm_model.keras"
DEFAULT_TOKENIZER_PATH = BACKEND_DIR / "models" / "tokenizer.pkl"


@dataclass
class ModelConfig:
    """Machine Learning Model Configuration"""
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(DEFAULT_MODEL_PATH))
    TOKENIZER_PATH: str = os.getenv("TOKENIZER_PATH", str(DEFAULT_TOKENIZER_PATH))
    MAX_SEQUENCE_LENGTH: int = 150
    EMBEDDING_DIM: int = 100
    LSTM_UNITS: int = 150
    DROPOUT_RATE: float = 0.5
    BATCH_SIZE: int = 32
    EPOCHS: int = 15
    LEARNING_RATE: float = 0.0001
    PREDICTION_THRESHOLD: float = 0.5
    MIN_WORD_LENGTH: int = 3


@dataclass
class TextProcessingConfig:
    """Text Preprocessing Configuration"""
    REMOVE_STOPWORDS: bool = True
    LEMMATIZE: bool = True
    LOWERCASE: bool = True
    MIN_WORD_LENGTH: int = 3
    LANGUAGE: str = "english"


@dataclass
class AppConfig:
    """Application Configuration"""
    # Server
    APP_NAME: str = "Fake News Detector"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    CORS_ORIGINS: list = field(
        default_factory=lambda: (
            [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
            or [
                "http://localhost:3000",
                "http://localhost:8000",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:8000",
            ]
        )
    )
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = str(PROJECT_ROOT / "logs" / "app.log")
    
    # API
    API_PREFIX: str = "/api/v1"
    API_TIMEOUT: int = 30
    MAX_INPUT_LENGTH: int = 5000
    MIN_INPUT_LENGTH: int = 10
    
    # Cache
    CACHE_TTL: int = 300  # 5 minutes
    
    # Dataset
    DATASET_PATH: str = str(PROJECT_ROOT / "dataset")
    
    # Artifacts
    ARTIFACTS_PATH: str = str(BACKEND_DIR / "artifacts")


# Export configurations
model_config = ModelConfig()
text_config = TextProcessingConfig()
app_config = AppConfig()
