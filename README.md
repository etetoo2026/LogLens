# LogLens

> Browser DevTools-style log viewer — paste JSON logs, then filter, search, and highlight in real time

## What it does
A web app where you paste raw JSON log output (from any server, Lambda, Docker, etc.) and instantly get a filterable, searchable, color-coded log explorer. No backend — runs entirely in the browser.

## Quick Start
```bash
git clone https://github.com/yourusername/LogLens
cd LogLens
npm install
npm run dev
# Open http://localhost:5173
```

## Features
- Paste or drag-drop JSON log arrays
- Filter by log level: `error`, `warn`, `info`, `debug`
- Full-text search with highlight
- Auto-detects common log shapes (Winston, Pino, AWS CloudWatch)
- Expand/collapse nested JSON fields
- Time-range slider filter
- Export filtered results as JSON or CSV
- Dark/light mode

## Tech Stack
| Tool | Why |
|------|-----|
| React 18 + TypeScript | Component-based log row rendering |
| Vite | Instant dev server |
| `zustand` | Filter state management |
| `date-fns` | Timestamp parsing + formatting |
| Tailwind CSS | Utility-first styling |

## Architecture
```
src/
├── components/
│   ├── LogViewer.tsx      # Virtual scrolling list of log rows
│   ├── FilterBar.tsx      # Level + search filters
│   ├── LogRow.tsx         # Single expandable log entry
│   └── Importer.tsx       # Paste / drag-drop input
├── store/
│   └── logStore.ts        # zustand: parsed logs + filter state
└── utils/
    └── parser.ts          # Detect + normalize log formats
```
