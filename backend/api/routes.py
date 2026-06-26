from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from pydantic import BaseModel
from typing import List, Optional
from services.ingestion import ingest_document
from services.rag import generate_answer
from core.database import SessionLocal, AuditLog
from sqlalchemy.orm import Session
from fastapi import Depends
import shutil
import os

router = APIRouter(prefix="/api")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ChatRequest(BaseModel):
    query: str
    compliance_mode: bool = False

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]
    latency: float

@router.post("/ingest")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Save to uploads directory
        file_location = f"uploads/{file.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # Ingest
        num_chunks = await ingest_document(file_location, file.filename)
        
        # We keep the file for the viewer
        
        return {"message": f"Successfully ingested {file.filename}", "chunks": num_chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        result = await generate_answer(request.query, request.compliance_mode)
        
        # Log to DB
        log_entry = AuditLog(
            query=request.query,
            answer=result["answer"],
            latency=result["latency"],
            compliance_mode=1 if request.compliance_mode else 0
        )
        db.add(log_entry)
        db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
