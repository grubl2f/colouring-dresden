#!/bin/sh

set -e

echo "OLD: kartoza/postgis image" source /scripts/env-data.sh


#export PGCONF_DIR="${CONF%/*.conf}"
export PGCONF_DIR="${PGDATA}"
export PGCONF="${PGCONF_DIR}/pg_hba.conf"


echo "POSTGRES_DB = [${POSTGRES_DB:?missing POSTGRES_DB}]"
echo "POSTGRES_USER = [${POSTGRES_USER:?missing POSTGRES_USER}]"
echo "POSTGRES_PASSWORD = [${POSTGRES_PASSWORD:+HIDDEN}]"
echo "POSTGRES_PASS = [${POSTGRES_PASS:+HIDDEN}]"
echo "PGDATA = [${PGDATA:?missing PGDATA}]"
echo "POSTGRES_HOST_AUTH_METHOD = [${POSTGRES_HOST_AUTH_METHOD}]"
#echo "POSTGRES_HOST_AUTH_METHOD = [${POSTGRES_HOST_AUTH_METHOD:?missing POSTGRES_HOST_AUTH_METHOD}]"
#echo "POSTGRES_MULTIPLE_EXTENSIONS = [${POSTGRES_MULTIPLE_EXTENSIONS:?missing POSTGRES_MULTIPLE_EXTENSIONS}]"
#echo "PGCONF = [${PGCONF:?missing PGCONF}]"
echo "PGCONF = [${PGCONF}]"


if [ -z "${POSTGRES_HOST_AUTH_METHOD}" ]; then
  echo "[POSTGRES_HOST_AUTH_METHOD=${POSTGRES_HOST_AUTH_METHOD}] is empty, no pw auth adjustments are asked to be applied"
  exit 0
fi


echo "# Authenticate all local users using [${POSTGRES_HOST_AUTH_METHOD}] method (except postgres user, if registered explicitly)"
echo "before substituion:[${PGCONF}]"
grep -E "^local" "${PGCONF}"
sed -i -E "s/^(local\s+all\s.+all.+)(peer)$/\1${POSTGRES_HOST_AUTH_METHOD}/g" "${PGCONF}"
sed -i -E "s/scram-sha-256/${POSTGRES_HOST_AUTH_METHOD}/g" "${PGCONF}"
echo "after substituion:[${PGCONF}]"
grep -E "^local" "${PGCONF}" || true
grep -E "^postgres" "${PGCONF}" || true

echo "set auth method in postgresql.conf to [${POSTGRES_HOST_AUTH_METHOD}]"
echo "password_encryption = '${POSTGRES_HOST_AUTH_METHOD}'" >> "${PGCONF_DIR}/postgresql.conf"
# #DEBUG:
# echo "log_statement = 'all'" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_destination = 'stderr'" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_duration = on" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_min_messages = debug1" >> "${PGCONF_DIR}/postgresql.conf"

echo "Asked to adjust authentication method to [${POSTGRES_HOST_AUTH_METHOD}] (e.g. for Mapnik's older libpq) (except postgres user, if registered explicitly)"
#_CURRENT_POSTGRES_HOST_AUTH_METHOD=$(su - postgres -c "psql -c \"SHOW password_encryption;\"")
_CURRENT_POSTGRES_HOST_AUTH_METHOD=$(psql -c "SHOW password_encryption;")
if [ "${_CURRENT_POSTGRES_HOST_AUTH_METHOD}" = "${POSTGRES_HOST_AUTH_METHOD}" ]; then
  echo "[POSTGRES_HOST_AUTH_METHOD=${POSTGRES_HOST_AUTH_METHOD}] is already same as the current [${_CURRENT_POSTGRES_HOST_AUTH_METHOD}], no pw auth adjustments are required"
else
# if ! su - postgres -c "psql -c \"select rolpassword from pg_authid where rolname = '${POSTGRES_USER}';\" | grep -E '^md5'" >/dev/null; then
  echo "Applying Mapnik libpq pw [scram-sha-256 -> ${POSTGRES_HOST_AUTH_METHOD}] workaround...."
  #su - postgres -c "psql -c \"alter role ${POSTGRES_USER} PASSWORD '${POSTGRES_PASSWORD}';\""
  psql -c "alter role ${POSTGRES_USER} PASSWORD '${POSTGRES_PASSWORD}';"
  psql -c "select rolpassword from pg_authid where rolname = '${POSTGRES_USER}';" | grep -E "^${POSTGRES_HOST_AUTH_METHOD}" || true # >/dev/null
  echo "Mapnik libpq pw [scram-sha-256 -> ${POSTGRES_HOST_AUTH_METHOD}] workaround has been applied."
# fi
fi

echo "which pg_ctl"
which pg_ctl
echo "reload"
#su - postgres -c "$(which pg_ctl) reload -D ${PGDATA}"
pg_ctl reload -D "${PGDATA}"
#$(which pg_ctl) reload -D "${PGDATA}"
echo "reload: done"

echo "Restart db"
pg_ctl stop -D "${PGDATA}" -m smart
sleep 2
pg_ctl start -D "${PGDATA}"

echo "Check db is running"
while ! psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\l"; do
  echo -n "."
  sleep 1
done
echo "Postggresql is accessible now"
echo "################################################################################"
