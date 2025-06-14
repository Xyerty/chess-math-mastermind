
#!/usr/bin/env python3
import subprocess
import sys
import os
import time

def install_requirements():
    """Install required Python packages"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        return False

def start_server():
    """Start the Flask server"""
    try:
        from app import app
        print("Starting Python chess engine on http://127.0.0.1:8000")
        app.run(host='127.0.0.1', port=8000, debug=False)
    except ImportError:
        print("Installing dependencies first...")
        if install_requirements():
            time.sleep(2)
            start_server()
        else:
            print("Failed to install dependencies")
            sys.exit(1)

if __name__ == "__main__":
    start_server()
