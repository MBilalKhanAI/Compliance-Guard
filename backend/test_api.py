import requests
import os

# Ensure we're in the backend directory
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# Test the actual API endpoint
url = "http://localhost:8000/api/ingest"

# Try uploading the existing PDF
with open("uploads/article.pdf", "rb") as f:
    files = {"file": ("article.pdf", f, "application/pdf")}
    
    print("Sending request to API...")
    response = requests.post(url, files=files)
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ SUCCESS!")
    else:
        print("\n❌ FAILED!")
