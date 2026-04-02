#!/usr/bin/env python3
"""
Render deployment initialization script.
Verifies model and tokenizer files are available before server starts.
"""
import os
import sys
from pathlib import Path

def verify_deployment():
    """Verify all required files are present for deployment."""
    print("=== Render Deployment Verification ===")
    
    # Get paths - script is in backend/, so parent is backend dir
    script_dir = Path(__file__).parent.resolve()
    
    # Check if we're running from project root or backend dir
    if script_dir.name == "backend":
        backend_dir = script_dir
    else:
        backend_dir = script_dir / "backend"
    
    models_dir = backend_dir / "models"
    
    print(f"Backend dir: {backend_dir}")
    print(f"Models dir: {models_dir}")
    print(f"Working dir: {os.getcwd()}")
    
    # Check model files
    model_file = None
    for candidate in [
        models_dir / "fake_news_lstm_model.h5",
        models_dir / "fake_news_lstm_model.keras",
    ]:
        if candidate.exists():
            model_file = candidate
            print(f"Found model: {candidate} ({candidate.stat().st_size / 1024 / 1024:.1f} MB)")
            break
    
    if not model_file:
        print("ERROR: Model file not found!")
        return False
    
    # Check tokenizer
    tokenizer_file = models_dir / "tokenizer.pkl"
    if tokenizer_file.exists():
        print(f"Found tokenizer: {tokenizer_file} ({tokenizer_file.stat().st_size / 1024:.1f} KB)")
    else:
        print("ERROR: Tokenizer not found!")
        return False
    
    print("=== Verification Complete ===")
    return True

if __name__ == "__main__":
    if not verify_deployment():
        sys.exit(1)
    print("Deployment ready!")
