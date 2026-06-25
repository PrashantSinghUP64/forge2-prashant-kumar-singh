#!/bin/bash
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

php artisan key:generate --no-interaction --force 2>/dev/null || true

chmod -R 777 storage bootstrap/cache database || true

php artisan migrate --force

php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
