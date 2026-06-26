import asyncio
import sys
import os

# Ensure we're in the backend directory
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

async def test_upload():
    try:
        print("=" * 80)
        print("TESTING PDF UPLOAD")
        print("=" * 80)
        
        from services.ingestion import ingest_document
        
        # Test with the existing PDF
        test_file = "uploads/article.pdf"
        
        if os.path.exists(test_file):
            print(f"\nFile exists: {test_file}")
            print(f"File size: {os.path.getsize(test_file)} bytes\n")
            
            result = await ingest_document(test_file, "article.pdf")
            
            print("\n" + "=" * 80)
            print(f"SUCCESS! Ingested {result} chunks")
            print("=" * 80)
        else:
            print(f"ERROR: File not found: {test_file}")
            
    except Exception as e:
        print("\n" + "=" * 80)
        print("ERROR OCCURRED:")
        print("=" * 80)
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_upload())
