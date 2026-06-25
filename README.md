# Forge 2 Qualifier - Kanban Board

A Trello-style Kanban board built with Laravel and React. Supports boards, lists, cards, tags, members, and due dates.

## Stack

- **Backend**: Laravel 11, SQLite, PHP 8.4
- **Frontend**: React 19, Vite, Axios

## Models

- Hermes (Brain/Orchestrator): Groq openai/gpt-oss-120b
- OpenClaw (Hands/Coder): Ollama qwen2.5-coder

## Running Locally

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Live

- **Frontend**: https://forge2-prashant-kumar-singh-nv6r84gt8.vercel.app/
- **Backend API**: https://forge2-qualifier-prashant-kumar-singh-production.up.railway.app/api
