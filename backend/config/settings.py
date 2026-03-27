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

# Project root directory - try multiple ways to find it
_script_dir = Path(__file__).resolve().parent
_config_dir = _script_dir.parent
_backend_dir = _config_dir.parent
PROJECT_ROOT = _backend_dir.parent

# Determine BACKEND_DIR - check multiple locations
_possible_backend_dirs = [
    _backend_dir,
    PROJECT_ROOT / "backend",
    Path("/app/backend"),
    Path.cwd() / "backend",
]

BACKEND_DIR = None
for d in _possible_backend_dirs:
    if d.exists() and d.is_dir():
        BACKEND_DIR = d
        break

if BACKEND_DIR is None:
    BACKEND_DIR = _backend_dir

# Model paths - allow override via environment variables
MODEL_FILENAME = "fake_news_lstm_model.keras"
TOKENIZER_FILENAME = "tokenizer.pkl"

# Get model path from env var or use default
_env_model_path = os.getenv("MODEL_PATH")
_env_tokenizer_path = os.getenv("TOKENIZER_PATH")


@dataclass
class ModelConfig:
    """Machine Learning Model Configuration"""
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(BACKEND_DIR / "models" / MODEL_FILENAME))
    TOKENIZER_PATH: str = os.getenv("TOKENIZER_PATH", str(BACKEND_DIR / "models" / TOKENIZER_FILENAME))
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
