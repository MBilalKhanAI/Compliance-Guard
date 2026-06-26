import core.patch_pypdf
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader # fixed dependency
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from core.config import settings
from pinecone import Pinecone
import time

# Initialize Pinecone
# Initialize Pinecone
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

embeddings = OpenAIEmbeddings(
    model=settings.EMBEDDING_MODEL,
    dimensions=settings.EMBEDDING_DIMENSIONS,
    api_key=settings.OPENAI_API_KEY
)

vector_store = PineconeVectorStore(
    index=index,
    embedding=embeddings
)

async def ingest_document(file_path: str, original_filename: str) -> int:
    try:
        # 1. Load Document
        print(f"[INGEST] Starting ingestion of {original_filename} from {file_path}")
        
        if file_path.lower().endswith('.pdf'):
            print(f"[INGEST] Using PyPDFLoader for {original_filename}")
            loader = PyPDFLoader(file_path)
        elif file_path.lower().endswith('.docx'):
            print(f"[INGEST] Using Docx2txtLoader for {original_filename}")
            loader = Docx2txtLoader(file_path)
        else:
            raise ValueError(f"Unsupported file type: {original_filename}")
        
        print(f"[INGEST] Loading document...")
        documents = loader.load()
        print(f"[INGEST] Loaded {len(documents)} document(s)")
        
        if not documents:
            raise ValueError(f"No content extracted from {original_filename}")
        
        # 2. Add Metadata
        print(f"[INGEST] Adding metadata...")
        for doc in documents:
            doc.metadata["source"] = original_filename
            doc.metadata["ingest_date"] = str(time.time())
            # Page number is already in metadata as 'page' (0-indexed)
            doc.metadata["page_label"] = str(doc.metadata.get("page", 0) + 1)

        # 3. Split Text
        print(f"[INGEST] Splitting text into chunks...")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            add_start_index=True
        )
        chunks = text_splitter.split_documents(documents)
        print(f"[INGEST] Created {len(chunks)} chunks")
        
        # 4. Index to Pinecone
        print(f"[INGEST] Indexing to Pinecone...")
        vector_store.add_documents(chunks)
        print(f"[INGEST] Successfully indexed {len(chunks)} chunks")
        
        return len(chunks)
        
    except Exception as e:
        print(f"[INGEST ERROR] Failed to ingest {original_filename}")
        print(f"[INGEST ERROR] Error type: {type(e).__name__}")
        print(f"[INGEST ERROR] Error message: {str(e)}")
        import traceback
        print(f"[INGEST ERROR] Traceback:\n{traceback.format_exc()}")
        raise  # Re-raise the exception so FastAPI returns 500
