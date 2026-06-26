# ComplianceGuard — Backend

FastAPI-powered REST API server with a LangGraph agentic RAG engine.

## Stack

| Layer | Technology |
|---|---|
| API Framework | FastAPI + Uvicorn |
| RAG Orchestration | LangGraph (stateful workflow) |
| LLM | OpenAI GPT-4o (temperature=0) |
| Embeddings | OpenAI text-embedding-3-small (512 dims) |
| Vector DB | Pinecone Serverless |
| PDF Parsing | PyPDF + pdfminer.six |
| ORM | SQLAlchemy 2.0 + SQLite |

## Structure

```
backend/
├── api/
│   ├── analytics.py    # GET /api/analytics/* — stats, trends, topics
│   ├── documents.py    # GET/DELETE /api/documents/*
│   └── routes.py       # POST /api/ingest, POST /api/chat
├── core/
│   ├── config.py       # Environment settings (dotenv)
│   ├── database.py     # SQLAlchemy engine + AuditLog model
│   ├── graph.py        # LangGraph: retrieve → generate nodes
│   └── patch_pypdf.py  # Font-descriptor fault-tolerance patch for pypdf
├── services/
│   ├── ingestion.py    # Load → split → embed → index pipeline
│   └── rag.py          # generate_answer() — invokes LangGraph app
├── uploads/            # Uploaded files (git-ignored)
├── .env.example        # Template — copy to .env and fill in keys
├── requirements.txt
└── main.py             # FastAPI entry point
```

## Quick Start

```bash
python -m venv venv
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env      # then edit .env with your API keys
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Testing

```bash
# Test the full ingestion pipeline directly
python test_ingest.py

# Test via live HTTP API (requires running server)
python test_api.py
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | ✅ | — | OpenAI API key |
| `PINECONE_API_KEY` | ✅ | — | Pinecone API key |
| `PINECONE_INDEX_NAME` | ✅ | — | Pinecone index name |
| `PINECONE_HOST` | ✅ | — | Pinecone index host URL |
| `DATABASE_URL` | ❌ | `sqlite:///./compliance_logs.db` | SQLAlchemy database URL |
| `EMBEDDING_MODEL` | ❌ | `text-embedding-3-small` | OpenAI embedding model |
| `EMBEDDING_DIMENSIONS` | ❌ | `512` | Embedding vector dimensions |

See the [root README](../README.md) for full project documentation.
