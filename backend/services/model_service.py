"""
Model Loading and Inference Service
Handles model and tokenizer loading with caching
"""

import pickle
import logging
from typing import Optional, Tuple
import numpy as np
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

import os

import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
from backend.config.settings import model_config
from backend.utils.text_processor import get_preprocessor

logger = logging.getLogger(__name__)


class ModelService:
    """
    Manages model lifecycle and inference
    Implements singleton pattern for efficient resource usage
    """
    
    _instance: Optional['ModelService'] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        self._initialized = True
        self.model = None
        self.tokenizer = None
        self.preprocessor = get_preprocessor()
        try:
            self._load_artifacts()
        except Exception as e:
            logger.error(f"Failed to load model artifacts during init: {str(e)}")
            # Don't re-raise - allow service to exist but mark as not ready
    
    def _load_artifacts(self) -> None:
        """Load model and tokenizer from disk"""
        import traceback
        
        logger.info(f"Current working directory: {os.getcwd()}")
        logger.info(f"__file__: {__file__}")
        
        # Find the backend directory
        script_dir = Path(__file__).resolve().parent  # backend/services/
        backend_dir = script_dir.parent  # backend/
        project_root = backend_dir.parent  # project root
        
        logger.info(f"Backend dir: {backend_dir}, exists: {backend_dir.exists()}")
        logger.info(f"Project root: {project_root}")
        
        # Check environment variables first
        env_model_path = os.getenv("MODEL_PATH")
        env_tokenizer_path = os.getenv("TOKENIZER_PATH")
        
        # Find model path
        model_path = None
        
        # Check env var first
        if env_model_path:
            p = Path(env_model_path)
            logger.info(f"Checking env MODEL_PATH: {p}, exists: {p.exists()}")
            if p.exists():
                model_path = p
        
        # Check default locations
        if model_path is None:
            for loc in [
                backend_dir / "models" / "fake_news_lstm_model.h5",
                backend_dir / "models" / "fake_news_lstm_model.keras",
                backend_dir / "models" / "fake_news_lstm_model",
                backend_dir / "artifacts" / "fake_news_lstm_model.h5",
                backend_dir / "artifacts" / "fake_news_lstm_model.keras",
            ]:
                logger.info(f"Checking: {loc}, exists: {loc.exists()}")
                if loc.exists():
                    model_path = loc
                    break
        
        # If still not found, list all files in backend dir
        if model_path is None:
            logger.error(f"Model not found! Listing backend dir contents:")
            for item in backend_dir.glob('**/*'):
                if item.is_file():
                    logger.error(f"  Found: {item}")
            raise FileNotFoundError("Model file not found")
        
        logger.info(f"Loading model from: {model_path}")
        
        # Find tokenizer path
        tokenizer_path = None
        
        if env_tokenizer_path:
            p = Path(env_tokenizer_path)
            if p.exists():
                tokenizer_path = p
        
        if tokenizer_path is None:
            for loc in [
                backend_dir / "models" / "tokenizer.pkl",
                backend_dir / "artifacts" / "tokenizer.pkl",
            ]:
                if loc.exists():
                    tokenizer_path = loc
                    break
        
        if tokenizer_path is None:
            raise FileNotFoundError("Tokenizer file not found")
        
        logger.info(f"Loading tokenizer from: {tokenizer_path}")
        
        try:
            # Load model
            self.model = tf.keras.models.load_model(str(model_path))
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            logger.error(traceback.format_exc())
            raise
        
        try:
            # Load tokenizer
            with open(str(tokenizer_path), "rb") as f:
                self.tokenizer = pickle.load(f)
            logger.info("Tokenizer loaded successfully")
        except Exception as e:
            logger.error(f"Error loading tokenizer: {e}")
            logger.error(traceback.format_exc())
            raise
    
    def predict(self, text: str) -> Tuple[str, float, float, float]:
        """
        Predict whether text is fake or real news
        
        Args:
            text: Input text to classify
            
        Returns:
            Tuple of (label, confidence, prob_fake, prob_real)
        """
        if not self.model or not self.tokenizer:
            raise RuntimeError("Model artifacts not loaded")
        
        try:
            # Preprocess text
            cleaned = self.preprocessor.clean_text(text)
            if not cleaned:
                logger.warning("Text preprocessing resulted in empty string")
                return "UNKNOWN", 0.5, 0.5, 0.5
            
            # Tokenize
            sequences = self.tokenizer.texts_to_sequences([cleaned])
            if not sequences or not sequences[0]:
                logger.warning("Tokenization resulted in empty sequence")
                return "UNKNOWN", 0.5, 0.5, 0.5
            
            # Pad sequences
            padded = pad_sequences(sequences, maxlen=model_config.MAX_SEQUENCE_LENGTH)
            
            # Predict
            prediction = float(self.model.predict(padded, verbose=0)[0][0])
            
            # Calculate probabilities
            prob_real = prediction * 100.0
            prob_fake = (1.0 - prediction) * 100.0
            
            # Determine label
            label = "REAL" if prediction > model_config.PREDICTION_THRESHOLD else "FAKE"
            confidence = max(prob_real, prob_fake)
            
            logger.info(f"Prediction: {label} (confidence: {confidence:.2f}%)")
            
            return label, confidence, prob_fake, prob_real
            
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            raise
    
    def batch_predict(self, texts: list[str]) -> list[dict]:
        """
        Predict multiple texts at once
        
        Args:
            texts: List of texts to classify
            
        Returns:
            List of prediction dictionaries
        """
        results = []
        for text in texts:
            try:
                label, confidence, prob_fake, prob_real = self.predict(text)
                results.append({
                    "text": text[:100] + "..." if len(text) > 100 else text,
                    "label": label,
                    "confidence": round(confidence, 2),
                    "prob_fake": round(prob_fake, 2),
                    "prob_real": round(prob_real, 2),
                })
            except Exception as e:
                logger.error(f"Error predicting text: {str(e)}")
                results.append({
                    "text": text[:100] + "..." if len(text) > 100 else text,
                    "error": str(e)
                })
        
        return results
    
    @property
    def is_ready(self) -> bool:
        """Check if model is ready for inference"""
        return self.model is not None and self.tokenizer is not None


def get_model_service() -> ModelService:
    """Get singleton instance of ModelService"""
    return ModelService()
