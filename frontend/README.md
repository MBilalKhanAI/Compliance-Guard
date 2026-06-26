# ComplianceGuard — Frontend

Next.js 15 enterprise dashboard for the ComplianceGuard RAG system.

## Stack

| | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| State | Zustand |

## Pages

| Route | Description |
|---|---|
| `/dashboard` | Main workspace: chat panel + in-line PDF viewer |
| `/dashboard/analytics` | Query trends and topic distribution charts |
| `/dashboard/chat` | Full-screen dedicated chat view |
| `/dashboard/documents` | Document library — browse and upload |
| `/dashboard/history` | Past query history log |
| `/dashboard/settings` | Application configuration panel |

## Quick Start

```bash
pnpm install   # or: npm install
pnpm dev       # or: npm run dev
```

Opens at: http://localhost:3000

The frontend expects the backend API at `http://localhost:8000`. Make sure the backend is running first.

## Build

```bash
pnpm build   # Production build
pnpm start   # Serve production build
```

See the [root README](../README.md) for full project documentation.
