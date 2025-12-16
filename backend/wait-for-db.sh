#!/bin/sh
#set -e

# Hardcode
#DB_HOST="db"
#DB_USER="postgres"
#DB_PASSWORD="123"
#DB_NAME="codsylla"


#echo "Esperando a que la base de datos esté lista en $DB_HOST..."

#while ! PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q' >/dev/null 2>&1; do
#  echo "DB no lista, esperando 2s..."
#  sleep 2
#done

#echo "DB lista, ejecutando comando..."
# Ejecuta todo lo que le pases como CMD
#exec "$@"

#!/bin/sh
set -e

echo "Esperando a que la base de datos esté lista en $DATABASE_URL..."

# Extraer host, usuario y nombre de la DB desde DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -E 's|postgresql://[^:]+:([^@]+)@([^:/]+).*|\2|')
DB_USER=$(echo $DATABASE_URL | sed -E 's|postgresql://([^:]+):.*|\1|')
DB_PASSWORD=$(echo $DATABASE_URL | sed -E 's|postgresql://[^:]+:([^@]+)@.*|\1|')
DB_NAME=$(echo $DATABASE_URL | sed -E 's|.*/([^?]+).*|\1|')

# Esperar a que la DB esté lista
until psql "$DATABASE_URL" -c '\q' >/dev/null 2>&1; do
  echo "DB no lista, esperando 2s..."
  sleep 2
done

echo "DB lista, ejecutando migraciones y app..."

# Ejecutar migraciones y luego la app
npx prisma migrate deploy
npx prisma db seed
exec "$@"
