#!/bin/bash
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

php artisan key:generate --no-interaction --force 2>/dev/null || true

chmod -R 777 storage bootstrap/cache database || true

php artisan config:clear || true
php artisan route:clear || true
php artisan cache:clear || true

php artisan migrate --force

# Seed only if boards table is empty
BOARD_COUNT=$(php artisan tinker --no-interaction --execute="echo App\Models\Board::count();" 2>/dev/null | tail -1 || echo "0")
if [ "$BOARD_COUNT" = "0" ]; then
    php artisan db:seed --force 2>/dev/null || true
fi

php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
