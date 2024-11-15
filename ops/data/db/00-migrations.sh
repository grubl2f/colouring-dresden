#!/bin/sh


source /scripts/env-data.sh


MIGRATIONS_DIR="/docker-entrypoint-initdb.d/migrations"
echo "MIGRATIONS_DIR = [${MIGRATIONS_DIR}]"
export PGCONF_DIR="${CONF%/*.conf}"
export PGCONF="${PGCONF_DIR}/pg_hba.conf"


echo "POSTGRES_DBNAME = [${POSTGRES_DBNAME:?missing POSTGRES_DBNAME}]"
echo "DB_PORT = [${DB_PORT:?missing DB_PORT}]"
echo "POSTGRES_USER = [${POSTGRES_USER:?missing POSTGRES_USER}]"
echo "POSTGRES_PASSWORD = [${POSTGRES_PASSWORD:+HIDDEN}]"
echo "POSTGRES_PASS = [${POSTGRES_PASS:+HIDDEN}]"
echo "PGDATA = [${PGDATA:?missing PGDATA}]"
echo "POSTGRES_HOST_AUTH_METHOD = [${POSTGRES_HOST_AUTH_METHOD:?missing POSTGRES_HOST_AUTH_METHOD}]"
echo "POSTGRES_MULTIPLE_EXTENSIONS = [${POSTGRES_MULTIPLE_EXTENSIONS:?missing POSTGRES_MULTIPLE_EXTENSIONS}]"
echo "PGCONF = [${PGCONF:?missing PGCONF}]"


echo "################################################################################"
echo "# #TODO:FIX: authenticate local users also internally, except postgres user"
echo "################################################################################"
echo "before substituion:[${PGCONF}]"
grep -E "^local" "${PGCONF}"
sed -i -E "s/^(local\s+all\s.+all.+)(peer)$/\1${POSTGRES_HOST_AUTH_METHOD}/g" "${PGCONF}"
sed -i -E "s/scram-sha-256/${POSTGRES_HOST_AUTH_METHOD}/g" "${PGCONF}"
echo "after substituion:[${PGCONF}]"
grep -E "^local" "${PGCONF}"
echo "################################################################################"
echo "set auth method in postgresql.conf to [${POSTGRES_HOST_AUTH_METHOD}]"
echo "password_encryption = '${POSTGRES_HOST_AUTH_METHOD}'" >> "${PGCONF_DIR}/postgresql.conf"
# DEBUG:
# echo "log_statement = 'all'" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_destination = 'stderr'" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_duration = on" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_min_messages = debug1" >> "${PGCONF_DIR}/postgresql.conf"
echo "################################################################################"
su - postgres -c "$(which pg_ctl) reload -D ${PGDATA}"
echo "################################################################################"

echo "################################################################################"
echo "# MIGRATIONS:"
echo "################################################################################"
# Check if migrations have already been applied
if ! psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DBNAME" -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'migration_status';" | grep -q "1"; then
  echo "#WORKAROUND:PG15+: update password using the [${POSTGRES_HOST_AUTH_METHOD}]..."
  su - postgres -c "psql -c \"alter role ${POSTGRES_USER} PASSWORD '${POSTGRES_PASSWORD}';\""
  su - postgres -c "psql -c \"select rolpassword from pg_authid where rolname = '${POSTGRES_USER}';\" | grep -E '^md5'" >/dev/null

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