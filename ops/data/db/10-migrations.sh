#!/bin/sh


source /scripts/env-data.sh


MIGRATIONS_DIR="/docker-entrypoint-initdb.d/migrations"
echo "MIGRATIONS_DIR = [${MIGRATIONS_DIR}]"


echo "################################################################################"
echo "# MIGRATIONS:"
echo "################################################################################"
# Check if migrations have already been applied
if ! psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DBNAME" -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'migration_status';" | grep -q "1"; then
  echo "Running database migrations..."
  for f in "$MIGRATIONS_DIR"/*.up.sql; do
    if echo "$f" | grep -vE "^.*/05(1|7|8).*$"; then
      echo "Applying migration: $f"
      psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DBNAME" -f "$f"
    else
      echo "TODO:FIX: Skipping problematic migration: [$f]"
    fi
  done
  echo "Creating migration status table..."
  psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DBNAME" -c "CREATE TABLE migration_status (id SERIAL PRIMARY KEY);"
  echo "Database migrations completed."
else
  echo "Database migrations already applied."
fi
echo "################################################################################"
