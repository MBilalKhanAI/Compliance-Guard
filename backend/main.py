import core.patch_pypdf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.routes import router
from api.documents import router as documents_router
from api.analytics import router as analytics_router
from core.database import init_db
import os

app = FastAPI(title="ComplianceGuard API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
uploads_dir = "uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

# Mount uploads directory for serving files
app.mount("/files", StaticFiles(directory=uploads_dir), name="files")

# Initialize database on startup
@app.on_event("startup")
def startup():
    init_db()

# Include routers
app.include_router(router)
app.include_router(documents_router)
app.include_router(analytics_router)

@app.get("/")
def read_root():
    return {"message": "ComplianceGuard API v2.0 is running"}
