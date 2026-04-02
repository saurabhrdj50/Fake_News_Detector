#!/usr/bin/env bash
# Render Build Script
# This script runs before the server starts to ensure all dependencies and LFS files are ready

set -e

echo "=== Render Build Script ==="
echo "Python version: $(python --version)"

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Ensure Git LFS is installed and files are fetched
echo "Setting up Git LFS..."
if command -v git-lfs &> /dev/null; then
    git lfs install
    git lfs pull
    echo "Git LFS files fetched successfully"
else
    echo "Warning: git-lfs not found, attempting to install..."
    pip install git-lfs || true
    git lfs install || true
    git lfs pull || echo "Warning: Could not pull LFS files"
fi

# Verify model files exist
echo "Checking model files..."
if [ -f "backend/models/fake_news_lstm_model.h5" ]; then
    echo "Model file found: backend/models/fake_news_lstm_model.h5"
    ls -la backend/models/
elif [ -f "backend/models/fake_news_lstm_model.keras" ]; then
    echo "Model file found: backend/models/fake_news_lstm_model.keras"
    ls -la backend/models/
else
    echo "Warning: No model file found in backend/models/"
    ls -la backend/ || true
fi

echo "=== Build Complete ==="
