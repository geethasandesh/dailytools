#!/usr/bin/env python3
"""
Setup script for the Background Remover Backend
"""

import subprocess
import sys
import os

def install_requirements():
    print("Installing backend requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def start_backend():
    print("Starting backend server...")
    try:
        # Change to backend directory
        os.chdir("backend")
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped.")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

if __name__ == "__main__":
    print("🚀 Setting up Background Remover Backend...")
    
    if install_requirements():
        print("\n🎯 Backend is ready!")
        print("📝 To start the backend server, run:")
        print("   python setup_backend.py")
        print("\n🌐 The API will be available at: http://localhost:8000")
        print("📱 Your frontend should work with the background remover now!")
        
        # Ask if user wants to start the server now
        response = input("\n❓ Do you want to start the backend server now? (y/n): ")
        if response.lower() in ['y', 'yes']:
            start_backend()
    else:
        print("❌ Setup failed. Please check the error messages above.") 