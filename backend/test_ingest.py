import traceback
import asyncio
import os

# Change to backend directory to ensure proper imports
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

async def test_ingest():
    try:
        from services.ingestion import ingest_document
        
        # Try to ingest one of the existing test documents
        test_file = "uploads/article.pdf"
        
        print(f"Testing ingestion of {test_file}...")
        result = await ingest_document(test_file, "article.pdf")
        print(f"Success! Ingested {result} chunks")
        
    except Exception as e:
        print("=" * 80)
        print("ERROR CAPTURED:")
        print("=" * 80)
        print(f"Exception type: {type(e).__name__}")
        print(f"Exception message: {str(e)}")
        print("\nFull traceback:")
        print(traceback.format_exc())
        print("=" * 80)
        
        # Save to file
        with open("error_traceback.txt", "w") as f:
            f.write(f"Exception type: {type(e).__name__}\n")
            f.write(f"Exception message: {str(e)}\n\n")
            f.write("Full traceback:\n")
            f.write(traceback.format_exc())
        
        print("\nError details saved to error_traceback.txt")

if __name__ == "__main__":
    asyncio.run(test_ingest())
