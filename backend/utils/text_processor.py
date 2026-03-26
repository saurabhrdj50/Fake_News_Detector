"""
Text Preprocessing Module
Centralized text cleaning and preprocessing logic
"""

import re
import logging
from typing import List, Optional
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

# Download required NLTK data
for resource in ["punkt", "wordnet", "stopwords", "punkt_tab", "omw-1.4"]:
    try:
        nltk.data.find(f"tokenizers/{resource}" if "punkt" in resource else f"corpora/{resource}")
    except LookupError:
        nltk.download(resource, quiet=True)

logger = logging.getLogger(__name__)


class TextPreprocessor:
    """
    Centralized text preprocessing pipeline
    Handles all text cleaning and normalization
    """
    
    def __init__(
        self,
        remove_stopwords: bool = True,
        lemmatize: bool = True,
        min_word_length: int = 3,
        language: str = "english"
    ):
        self.remove_stopwords = remove_stopwords
        self.lemmatize = lemmatize
        self.min_word_length = min_word_length
        self.language = language
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words(language)) if remove_stopwords else set()
    
    def clean_text(self, text: str) -> str:
        """
        Comprehensive text cleaning pipeline
        
        Args:
            text: Raw input text to clean
            
        Returns:
            Cleaned and preprocessed text
        """
        if not isinstance(text, str) or not text.strip():
            logger.warning("Empty or invalid text provided for cleaning")
            return ""
        
        try:
            # Step 1: Remove extra whitespace
            text = re.sub(r'\s+', ' ', text, flags=re.I).strip()
            
            # Step 2: Remove URLs
            text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
            
            # Step 3: Remove email addresses
            text = re.sub(r'\S+@\S+', '', text)
            
            # Step 4: Remove special characters but keep spaces
            text = re.sub(r'\W', ' ', str(text))
            
            # Step 5: Remove single characters
            text = re.sub(r'\s+[a-zA-Z]\s+', ' ', text)
            
            # Step 6: Remove any non-alphabetical characters
            text = re.sub(r'[^a-zA-Z\s]', '', text)
            
            # Step 7: Convert to lowercase
            text = text.lower()
            
            # Step 8: Tokenize
            words = word_tokenize(text)
            
            # Step 9: Filter and lemmatize
            processed_words = []
            for word in words:
                # Skip short words and stopwords
                if len(word) <= self.min_word_length:
                    continue
                if self.remove_stopwords and word in self.stop_words:
                    continue
                
                # Apply lemmatization if enabled
                if self.lemmatize:
                    word = self.lemmatizer.lemmatize(word)
                
                processed_words.append(word)
            
            result = ' '.join(processed_words)
            logger.debug(f"Cleaned text: {len(text)} chars → {len(result)} chars")
            return result
            
        except Exception as e:
            logger.error(f"Error cleaning text: {str(e)}")
            raise
    
    def preprocess_batch(self, texts: List[str]) -> List[str]:
        """
        Preprocess a batch of texts
        
        Args:
            texts: List of text strings to process
            
        Returns:
            List of cleaned texts
        """
        return [self.clean_text(text) for text in texts]
    
    def validate_text(self, text: str, min_length: int = 10, max_length: int = 5000) -> tuple[bool, Optional[str]]:
        """
        Validate input text
        
        Args:
            text: Text to validate
            min_length: Minimum text length
            max_length: Maximum text length
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not isinstance(text, str):
            return False, "Input must be text"
        
        text = text.strip()
        
        if not text:
            return False, "Text cannot be empty"
        
        if len(text) < min_length:
            return False, f"Text must be at least {min_length} characters"
        
        if len(text) > max_length:
            return False, f"Text exceeds maximum length of {max_length} characters"
        
        return True, None


# Global preprocessor instance
_preprocessor: Optional[TextPreprocessor] = None


def get_preprocessor() -> TextPreprocessor:
    """Singleton pattern for TextPreprocessor"""
    global _preprocessor
    if _preprocessor is None:
        _preprocessor = TextPreprocessor()
    return _preprocessor
