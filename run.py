#!/usr/bin/env python3
"""
Backend startup script with proper Python path handling.
Ensures imports work correctly from any execution location.
"""
import sys
from pathlib import Path

# Add project root to path for proper imports
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
