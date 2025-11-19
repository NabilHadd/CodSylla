#!/bin/sh
set -e

# Hardcode
DB_HOST="db"
DB_USER="postgres"
DB_PASSWORD="123"
DB_NAME="codsylla"

echo "Esperando a que la base de datos esté lista en $DB_HOST..."

while ! PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q' >/dev/null 2>&1; do
  echo "DB no lista, esperando 2s..."
  sleep 2
done

echo "DB lista, ejecutando comando..."
# Ejecuta todo lo que le pases como CMD
exec "$@"
