#!/bin/bash
set -e

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Generating app key if not set..."
php artisan key:generate --no-interaction 2>/dev/null || true

echo "==> Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
