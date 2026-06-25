FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN rm -f composer.lock && composer install --no-interaction --prefer-dist --optimize-autoloader

RUN mkdir -p database && touch database/database.sqlite

RUN chmod +x start.sh

RUN chmod -R 775 storage bootstrap/cache

EXPOSE ${PORT:-8000}

CMD ["./start.sh"]
