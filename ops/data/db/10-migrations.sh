#!/bin/sh

set -e

echo "OLD: kartoza/postgis image" source /scripts/env-data.sh


MIGRATIONS_DIR="/docker-entrypoint-initdb.d/migrations"
echo "MIGRATIONS_DIR = [${MIGRATIONS_DIR}]"


echo "################################################################################"
echo "# MIGRATIONS:"
echo "################################################################################"
#cat "${PGDATA}/postgresql.conf"
ls -la "${PGDATA}/postgresql.conf"
echo "################################################################################"

echo "Restart db"
pg_ctl stop -D "${PGDATA}" -m smart || true
#sleep 2
pg_ctl start -D "${PGDATA}"

echo "Check db is running"
while ! psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\l"; do
  echo -n "."
  sleep 1
done
echo "Postggresql is accessible now"

# Check extensions
#if ! psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'migration_status';" | grep -q "1"; then
echo "Installed extensions:"
psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT extname, extversion FROM pg_extension;"
psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
echo "Extension after install:"
psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT extname, extversion FROM pg_extension;"

# Check if migrations have already been applied
if ! psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'migration_status';" | grep -q "1"; then
  echo "Running database migrations..."
  for f in "$MIGRATIONS_DIR"/*.up.sql; do
    if echo "$f" | grep -vE "^.*/05(1|7|8).*$"; then
    #if echo "$f" | grep -vE "^.*/051.*$"; then
    #if echo "$f" | grep -vE "^.*/05(1|7).*$"; then
      echo "Applying migration: $f"
      psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
    else
      echo "TODO:FIX: Skipping problematic migration: [$f]"
    fi
  done
  echo "Creating migration status table..."
  psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE TABLE migration_status (id SERIAL PRIMARY KEY);"
  echo "Database migrations completed."
else
  echo "Database migrations already applied."
fi
echo "################################################################################"
