# Forge 2 Qualifier — Kanban Board

A Trello-style multi-agent Kanban board built for the NMG Labs Forge Sprint 02 Qualifier. The system demonstrates the full Hermes × OpenClaw orchestration loop running on Slack.

## Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 11, SQLite, PHP 8.4 |
| Frontend | React 19, Vite, Vanilla CSS |
| Orchestrator | Hermes Agent (`openai/gpt-oss-120b` via Groq) |
| Coder Agent | OpenClaw (`qwen2.5-coder` via Ollama) |
| Communication | Slack |
| CI/CD | GitHub Actions |

## Agent Architecture

**Hermes (Brain / Orchestrator)**
- Model: `openai/gpt-oss-120b` via Groq
- Handles planning, task decomposition, memory, and agent coordination
- Talks to the human in `#sprint-main`
- Has persistent memory — recalls project context without re-briefing
- Skills: `task-assign`, `memory-recall`, `status-report`

**OpenClaw (Hands / Coder)**
- Model: `qwen2.5-coder` via Ollama (local, no rate limits)
- Receives tasks in `#agent-coder`
- Writes code, runs commands, reports with **What I Did / What's Left / What Needs Your Call**
- Heartbeat: posts status every 30 min during active sprints

## Model Routing

| Task | Model | Reason |
|---|---|---|
| Planning, decomposition | `gpt-oss-120b` (Groq) | Needs strong reasoning |
| Code generation | `qwen2.5-coder` (Ollama) | Fast, local, no rate limits |
| Status reporting | `qwen2.5-coder` | Simple structured output |

## Slack Channels

| Channel | Purpose |
|---|---|
| `#sprint-main` | Human ↔ Hermes — goals, approvals, status |
| `#agent-coder` | Hermes → OpenClaw — task handoffs, code reports |
| `#agent-log` | Hermes auto-posts — cron runs, autonomous activity |
| `#ci-cd` | GitHub Actions results |
| `#human-review` | Items needing human approval before merge |

## Features

- Create boards, lists, and cards
- Edit card title and description
- Move cards between lists (dropdown in card modal)
- Add / remove colored tags
- Assign / remove members with avatars
- Set due dates — overdue cards highlighted red
- Delete cards
- REST API with full CRUD
- Health check endpoint (`/api/health`)
- Automated PHPUnit tests (15 assertions, full happy path)
- GitHub Actions CI on every push

## Running Locally

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed          # or GET /api/seed
php artisan serve            # → http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                  # → http://localhost:5173
```

## Live Deployments

- **Frontend**: https://forge2-prashant-kumar-singh-nv6r84gt8.vercel.app/
- **Backend API**: https://forge2-qualifier-prashant-kumar-singh-production.up.railway.app/api
- **Health Check**: https://forge2-qualifier-prashant-kumar-singh-production.up.railway.app/api/health

## Qualifier Evidence

- `agent-log.md` — full Slack conversation transcript showing the complete Hermes → OpenClaw loop, memory recall, skill fire, and autonomous scheduled run
- `ARCHITECTURE.md` — agent roles, model routing, data model
- `skills/` — Hermes skills: `status-report`, `task-assign`, `memory-recall`
- `openclaw-workspace/` — OpenClaw `IDENTITY.md`, `SOUL.md`, `HEARTBEAT.md`
- `.github/workflows/ci.yml` — automated CI pipeline
