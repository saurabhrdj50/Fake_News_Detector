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

from tensorflow.keras.models import load_model
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
        self._load_artifacts()
    
    def _load_artifacts(self) -> None:
        """Load model and tokenizer from disk"""
        try:
            logger.info(f"Loading model from {model_config.MODEL_PATH}")
            self.model = load_model(model_config.MODEL_PATH)
            logger.info("Model loaded successfully")
            
            logger.info(f"Loading tokenizer from {model_config.TOKENIZER_PATH}")
            with open(model_config.TOKENIZER_PATH, "rb") as f:
                self.tokenizer = pickle.load(f)
            logger.info("Tokenizer loaded successfully")
            
        except FileNotFoundError as e:
            logger.error(f"Artifact file not found: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error loading artifacts: {str(e)}")
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
