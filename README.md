<div align="center">

# ComplianceGuard

### Enterprise RAG System for Regulatory Intelligence

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agentic_RAG-blueviolet?style=for-the-badge&logo=chainlink&logoColor=white)](https://www.langchain.com/langgraph)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-6A0DAD?style=for-the-badge&logo=pinecone&logoColor=white)](https://www.pinecone.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

*An enterprise-grade, citation-first Retrieval-Augmented Generation (RAG) platform for compliance, legal, and regulatory teams in FinTech, Healthcare, and Legal industries.*

</div>

---

## 📂 Codebase Navigation

> Jump straight to the code that interests you most.

| Area | Path | Description |
|---|---|---|
| **Backend API** | [`backend/`](./backend) | FastAPI server, RAG engine, ingestion pipeline |
| **Frontend UI** | [`frontend/`](./frontend) | Next.js 15 dashboard — chat, analytics, documents |
| **LangGraph RAG** | [`backend/core/graph.py`](./backend/core/graph.py) | Stateful retrieve → generate agentic workflow |
| **PDF Ingestion** | [`backend/services/ingestion.py`](./backend/services/ingestion.py) | Loader, chunker, and Pinecone indexer |
| **Chat Interface** | [`frontend/components/ChatInterface.tsx`](./frontend/components/ChatInterface.tsx) | Real-time chat with citation rendering |
| **Analytics** | [`frontend/app/dashboard/analytics/page.tsx`](./frontend/app/dashboard/analytics/page.tsx) | Query trends and topic distribution charts |
| **Database Schema** | [`backend/core/database.py`](./backend/core/database.py) | SQLAlchemy models and audit log ORM |
| **Configuration** | [`backend/core/config.py`](./backend/core/config.py) | Environment settings |
| **API Routes** | [`backend/api/routes.py`](./backend/api/routes.py) | Core /ingest and /chat endpoint handlers |

---

## ✨ Core Features

### Citation-First RAG

Every answer is sourced. In **Strict Compliance Mode**, the system returns `"Insufficient regulatory context found."` rather than generating unsupported text. Citations render as clickable `[Document: Page]` links that open the source PDF to the exact page.

### Agentic Workflow via LangGraph

The query pipeline is a **stateful graph** with discrete `retrieve` and `generate` nodes built on LangGraph. This architecture is designed to extend into multi-agent patterns (Planner → Researcher → Critic) and self-correction loops without re-architecting the core.

### Intelligent Document Ingestion

- **Supported formats:** PDF, DOCX
- **Parser:** `PyPDFLoader` with a custom fault-tolerance patch for malformed font descriptors
- **Chunking:** `RecursiveCharacterTextSplitter` — 1,000 chars / 200 char overlap
- **Embeddings:** OpenAI `text-embedding-3-small` at 512 dimensions (Matryoshka-optimized)
- **Index:** Pinecone Serverless — dense vector search, top-k=5 retrieval

### Audit Trail & Analytics

Every query, response, latency, and compliance mode flag is persisted to SQLite via SQLAlchemy. The dashboard renders 7-day query trends and topic distribution charts powered by Recharts.

### Premium Enterprise UI

- Glassmorphism dark dashboard built with Next.js 15 + Tailwind CSS
- Side-by-side chat + PDF viewer with automatic scroll-to-cited-page
- Framer Motion micro-animations and streaming loading states
- Drag-and-drop PDF uploader

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                   Frontend  (Next.js 15 + TypeScript)              │
│  ┌──────────────┐  ┌────────────────┐  ┌───────────────────────┐  │
│  │ Chat + PDF   │  │  Analytics     │  │  Document Manager     │  │
│  │ Viewer       │  │  Dashboard     │  │  (Upload / Browse)    │  │
│  └──────────────┘  └────────────────┘  └───────────────────────┘  │
└──────────────────────────┬─────────────────────────────────────────┘
                           │  REST API  (CORS enabled)
┌──────────────────────────▼─────────────────────────────────────────┐
│                      Backend  (FastAPI)                              │
│                                                                      │
│  POST /api/ingest          POST /api/chat         GET /api/*        │
│        │                          │                                  │
│  ┌─────▼────────────┐   ┌─────────▼───────────────────────┐        │
│  │  Ingestion       │   │     LangGraph Workflow            │        │
│  │  Pipeline        │   │                                   │        │
│  │                  │   │  [retrieve] ──────► [generate]   │        │
│  │  Load → Split    │   │       │                   │       │        │
│  │  → Embed → Index │   │   Pinecone             GPT-4o   │        │
│  └─────┬────────────┘   └───────────────────────────────────┘        │
│        │                          │                                  │
└────────┼──────────────────────────┼───────────────────────────────────┘
         │                          │
   ┌─────▼──────┐            ┌──────▼──────┐      ┌─────────────┐
   │  Pinecone  │            │  OpenAI API │      │   SQLite    │
   │ (Vectors)  │            │ (LLM+Embed) │      │ (AuditLogs) │
   └────────────┘            └─────────────┘      └─────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | `3.11+` | Backend runtime |
| Node.js | `18+` | Frontend runtime |
| pnpm | `8+` | Package manager (or use npm) |
| OpenAI API Key | — | LLM inference + Embeddings |
| Pinecone Account | Free tier OK | Vector database |

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/complianceguard.git
cd complianceguard
```

---

### 2. Backend Setup

```bash
# Navigate into the backend
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt
```

**Configure your environment:**

```bash
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```env
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=pcsk-...
PINECONE_INDEX_NAME=complianceguard
PINECONE_HOST=https://complianceguard-xxxxx.svc.pinecone.io
```

> **Pinecone Setup:** Create a free index at [pinecone.io](https://www.pinecone.io/) with **Dimensions = 512** and **Metric = cosine**. Copy the API key and host URL into `.env`.

**Start the API server:**

```bash
uvicorn main:app --reload --port 8000
```

API docs auto-generated at: **http://localhost:8000/docs**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install  # or: npm install

# Start the dev server
pnpm dev      # or: npm run dev
```

Open **http://localhost:3000** in your browser.

---

## API Reference

### `POST /api/ingest`
Upload and index a PDF or DOCX document.

```bash
curl -X POST http://localhost:8000/api/ingest \
  -F "file=@regulation.pdf"
```

**Response:**
```json
{ "message": "Successfully ingested regulation.pdf", "chunks": 42 }
```

---

### `POST /api/chat`
Query the indexed document knowledge base.

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the data retention requirements?", "compliance_mode": true}'
```

**Response:**
```json
{
  "answer": "According to GDPR Article 5, personal data must not be kept longer than necessary... [GDPR_Guide.pdf: Page 34]",
  "sources": [{ "file": "GDPR_Guide.pdf", "page": "34", "content": "..." }],
  "latency": 1.83
}
```

---

### Other Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/documents/` | List all indexed documents |
| `DELETE` | `/api/documents/{id}` | Remove a document |
| `GET` | `/api/analytics/stats` | Aggregate system statistics |
| `GET` | `/api/analytics/trends` | 7-day query volume trends |
| `GET` | `/api/analytics/topics` | Topic distribution breakdown |
| `GET` | `/files/{filename}` | Serve raw uploaded PDF file |

---

## Project Structure

```
complianceguard/
│
├── backend/                      # FastAPI Python server
│   ├── api/
│   │   ├── analytics.py          # Analytics endpoints (/stats, /trends, /topics)
│   │   ├── documents.py          # Document CRUD endpoints
│   │   └── routes.py             # Core /ingest and /chat route handlers
│   ├── core/
│   │   ├── config.py             # Settings loaded from .env via python-dotenv
│   │   ├── database.py           # SQLAlchemy engine + AuditLog ORM model
│   │   ├── graph.py              # LangGraph stateful RAG workflow definition
│   │   └── patch_pypdf.py        # Fault-tolerance patch for pypdf font parsing
│   ├── services/
│   │   ├── ingestion.py          # PDF/DOCX loader, text splitter, Pinecone indexer
│   │   └── rag.py                # generate_answer() wrapper — invokes LangGraph
│   ├── uploads/                  # Uploaded documents (git-ignored; .gitkeep tracks dir)
│   ├── test_api.py               # Integration test (requires running server)
│   ├── test_ingest.py            # Direct ingestion pipeline test
│   ├── test_upload.py            # Upload flow test
│   ├── .env.example              # ✅ Environment variable template — safe to commit
│   ├── .env                      # ❌ Your secrets — never commit this
│   ├── requirements.txt          # Python dependency manifest
│   └── main.py                   # FastAPI application entry point
│
├── frontend/                     # Next.js 15 TypeScript application
│   ├── app/
│   │   ├── layout.tsx            # Root layout with global providers
│   │   ├── page.tsx              # Root page → redirects to /dashboard
│   │   └── dashboard/
│   │       ├── layout.tsx        # Dashboard shell (sidebar + topbar)
│   │       ├── page.tsx          # Main workspace: chat panel + PDF viewer
│   │       ├── analytics/        # Query trends and topic distribution charts
│   │       ├── chat/             # Dedicated full-screen chat view
│   │       ├── documents/        # Document library browser + upload
│   │       ├── history/          # Historical query log viewer
│   │       └── settings/         # Application configuration panel
│   ├── components/
│   │   ├── ChatInterface.tsx     # Core chat component with citation rendering
│   │   └── layout/               # Sidebar, header, and shared layout components
│   ├── lib/                      # API client, shared utilities, and types
│   ├── public/                   # Static assets (icons, images)
│   └── package.json              # Node dependencies and scripts
│
├── docker-compose.yml            # One-command local dev environment
├── .gitignore                    # Covers both backend and frontend exclusions
└── README.md                     # You are here
```

---

## Configuration Reference

### Compliance Modes

| Mode | `compliance_mode` | Behavior | Best For |
|---|---|---|---|
| **Strict** | `true` | Answers only from indexed documents. Returns `"Insufficient regulatory context found."` if absent. Temperature = 0. | Legal review, audit, sign-off |
| **Conversational** | `false` | Uses documents as primary context but allows broader guidance. More helpful. | Research, onboarding, exploration |

### Embedding Settings

```python
# backend/core/config.py
EMBEDDING_MODEL      = "text-embedding-3-small"  # OpenAI model
EMBEDDING_DIMENSIONS = 512                        # Matryoshka-reduced for speed
```

### Chunking Settings

```python
# backend/services/ingestion.py
RecursiveCharacterTextSplitter(
    chunk_size=1000,     # Characters per chunk
    chunk_overlap=200,   # Overlap to preserve cross-boundary context
    add_start_index=True
)
```

---

## Tech Stack

**Backend**

| Component | Technology | Role |
|---|---|---|
| API | FastAPI 0.110+ | Async REST API framework |
| Agent | LangGraph 0.1+ | Stateful agentic RAG workflow |
| LLM Ops | LangChain 0.2+ | Prompt templates and output parsing |
| Inference | OpenAI GPT-4o | LLM inference (temperature=0) |
| Database | Pinecone Serverless | Dense vector search |
| Parsing | PyPDF + pdfminer.six | Robust PDF text extraction |
| ORM | SQLAlchemy 2.0 + SQLite | Async-compatible ORM and audit store |

**Frontend**

| Component | Technology | Role |
|---|---|---|
| Framework | Next.js 15 (App Router) | React Server Components, fast routing |
| Language | TypeScript 5 | End-to-end type safety |
| Styling | Tailwind CSS 3 | Utility-first responsive styling |
| Animation | Framer Motion | Micro-animations and page transitions |
| Charts | Recharts | Analytics visualizations |
| State | Zustand | Lightweight global state management |

---

## Docker (Optional)

```bash
# Copy and configure secrets first
cp backend/.env.example backend/.env

# Start all services
docker-compose up --build
```

- Backend → **http://localhost:8000**
- Frontend → **http://localhost:3000**

---

## Security Notes

- API keys loaded exclusively from environment variables — never hardcoded.
- `.env` is in `.gitignore` and will never be pushed to the repository.
- `CORS` is set to `allow_origins=["*"]` for local dev — restrict to your domain in production.
- Uploaded files are stored in `backend/uploads/` and excluded from git.

---

## Performance

| Metric | Value |
|---|---|
| Average response time | < 3 seconds |
| Embedding dimensions | 512 (Matryoshka-optimized) |
| Retrieval top-k | 5 most relevant chunks |
| LLM temperature (strict) | 0 — deterministic outputs |
| Frontend bundle (shared) | ~100 kB |

---

## Roadmap

- [ ] Multi-user authentication (Clerk / Auth0)
- [ ] Role-based access control (RBAC)
- [ ] Document versioning and semantic diff tracking
- [ ] PostgreSQL migration for production deployments
- [ ] Streaming LLM responses (SSE) for lower perceived latency
- [ ] Multi-agent: Planner → Researcher → Critic pattern
- [ ] Export audit logs to PDF / Excel
- [ ] Slack / Teams integration for new regulatory alerts

---

## Author

**Muhammad Bilal Khan** — AI/ML Engineer

Specializing in production-grade RAG systems, LLM orchestration, and enterprise AI applications.

---

<div align="center">

*Built to demonstrate production-ready RAG engineering for enterprise compliance use cases.*

</div>
