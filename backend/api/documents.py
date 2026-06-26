from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os

router = APIRouter(prefix="/api/documents", tags=["documents"])

class DocumentResponse(BaseModel):
    id: str
    name: str
    size: str
    pages: int
    uploadDate: str
    tags: List[str]
    status: str

# Mock data for demonstration
mock_documents = [
    {
        "id": "1",
        "name": "GDPR Compliance Guide.pdf",
        "size": "2.4 MB",
        "pages": 156,
        "uploadDate": "2024-03-15",
        "tags": ["GDPR", "Privacy", "EU"],
        "status": "processed",
    },
    {
        "id": "2",
        "name": "Financial Regulations 2024.pdf",
        "size": "3.1 MB",
        "pages": 230,
        "uploadDate": "2024-03-14",
        "tags": ["Finance", "Regulations"],
        "status": "processed",
    },
]

@router.get("/", response_model=List[DocumentResponse])
async def list_documents():
    """List all documents with metadata"""
    # Get files from uploads directory
    uploads_dir = "uploads"
    if not os.path.exists(uploads_dir):
        return []
    
    documents = []
    for filename in os.listdir(uploads_dir):
        if filename.endswith('.pdf'):
            file_path = os.path.join(uploads_dir, filename)
            file_size = os.path.getsize(file_path)
            size_mb = file_size / (1024 * 1024)
            
            documents.append({
                "id": filename.replace('.pdf', ''),
                "name": filename,
                "size": f"{size_mb:.1f} MB",
                "pages": 0,  # Would need to parse PDF to get actual pages
                "uploadDate": datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat(),
                "tags": [],
                "status": "processed"
            })
    
    return documents

@router.get("/{document_id}")
async def get_document(document_id: str):
    """Get document details"""
    for doc in mock_documents:
        if doc["id"] == document_id:
            return doc
    raise HTTPException(status_code=404, detail="Document not found")

@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    file_path = f"uploads/{document_id}.pdf"
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"message": "Document deleted successfully"}
    raise HTTPException(status_code=404, detail="Document not found")
