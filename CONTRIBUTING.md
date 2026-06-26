# Contributing to ComplianceGuard

Thank you for your interest! This is a portfolio project — contributions are not actively accepted at this time, but feel free to open an issue if you find a bug or have a feature suggestion.

## Local Development

See the [README](./README.md) for full setup instructions.

### Backend

```bash
cd backend
.\venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Code Style

- **Python:** Follow PEP 8. Use type hints throughout.
- **TypeScript:** Strict mode enabled. No `any` types.
- **Commits:** Use conventional commit prefixes — `feat:`, `fix:`, `docs:`, `refactor:`.
