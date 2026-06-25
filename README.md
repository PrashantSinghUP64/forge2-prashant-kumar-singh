# Forge 2 Qualifier - Kanban Board

## What this app does
Trello-style Kanban board with boards, lists, cards, tags, members, due dates.

## Models Used
- Hermes (Brain/Orchestrator): Groq openai/gpt-oss-120b
- OpenClaw (Hands/Coder): Ollama qwen2.5-coder
- Why: Strong model for planning, local coding model for execution

## How to run locally
### Backend
```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

## Live URL
- **Frontend:** https://forge2-prashant-kumar-singh-nv6r84gt8.vercel.app/
- **Backend API:** https://forge2-qualifier-prashant-kumar-singh-production.up.railway.app/api
