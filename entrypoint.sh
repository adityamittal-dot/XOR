#!/bin/sh
set -e

if [ -n "$DB_NAME" ]; then
  echo "Waiting for database at ${DB_HOST:-localhost}:${DB_PORT:-5432}..."
  until python -c "
import os, sys, psycopg
try:
    psycopg.connect(
        dbname=os.environ['DB_NAME'],
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        host=os.environ.get('DB_HOST', 'localhost'),
        port=os.environ.get('DB_PORT', '5432'),
        connect_timeout=3,
    ).close()
except Exception as exc:
    print(exc, file=sys.stderr)
    sys.exit(1)
"; do
    sleep 1
  done
  echo "Database is up."
fi

python manage.py migrate --noinput

if [ "$DEBUG" != "True" ]; then
  python manage.py collectstatic --noinput
fi

exec "$@"
