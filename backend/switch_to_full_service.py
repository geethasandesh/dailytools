#!/usr/bin/env python3
"""
Script to switch from simple image background service to full rembg service
"""

import os
import shutil

def switch_to_full_service():
    """Switch to the full rembg-based image background service"""
    try:
        # Test if rembg is available
        import rembg
        print("✅ rembg is available, switching to full service...")
        
        # Update main.py to use the full service
        main_content = '''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services import image_bg, yt_to_mp3

app = FastAPI(
    title="Daily Tools API",
    description="Backend API for Daily Tools application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers from services
app.include_router(image_bg.router, prefix="/api/v1", tags=["image-processing"])
app.include_router(yt_to_mp3.router, prefix="/api/v1", tags=["media-conversion"])

@app.get("/")
async def root():
    return {"message": "Daily Tools API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": ["image-background-removal", "youtube-to-mp3"]}
'''
        
        with open('main.py', 'w') as f:
            f.write(main_content)
        
        print("✅ Successfully switched to full image background removal service!")
        print("🔄 Please restart the backend server to apply changes.")
        return True
        
    except ImportError as e:
        print(f"❌ rembg not available: {e}")
        print("📦 Installing dependencies...")
        
        # Try to install rembg
        import subprocess
        import sys
        
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'rembg', 'onnxruntime'])
            print("✅ Dependencies installed successfully!")
            print("🔄 Please run this script again to switch to full service.")
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies. Please install manually:")
            print("   pip install rembg onnxruntime")
        
        return False

if __name__ == "__main__":
    switch_to_full_service() 