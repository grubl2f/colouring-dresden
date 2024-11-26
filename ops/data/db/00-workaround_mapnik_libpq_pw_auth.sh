#!/bin/sh


source /scripts/env-data.sh


export PGCONF_DIR="${CONF%/*.conf}"
export PGCONF="${PGCONF_DIR}/pg_hba.conf"


echo "POSTGRES_DBNAME = [${POSTGRES_DBNAME:?missing POSTGRES_DBNAME}]"
echo "POSTGRES_USER = [${POSTGRES_USER:?missing POSTGRES_USER}]"
echo "POSTGRES_PASSWORD = [${POSTGRES_PASSWORD:+HIDDEN}]"
echo "POSTGRES_PASS = [${POSTGRES_PASS:+HIDDEN}]"
echo "PGDATA = [${PGDATA:?missing PGDATA}]"
echo "POSTGRES_HOST_AUTH_METHOD = [${POSTGRES_HOST_AUTH_METHOD:?missing POSTGRES_HOST_AUTH_METHOD}]"
echo "POSTGRES_MULTIPLE_EXTENSIONS = [${POSTGRES_MULTIPLE_EXTENSIONS:?missing POSTGRES_MULTIPLE_EXTENSIONS}]"
echo "PGCONF = [${PGCONF:?missing PGCONF}]"


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
grep -E "^local" "${PGCONF}"
grep -E "^postgres" "${PGCONF}"

echo "set auth method in postgresql.conf to [${POSTGRES_HOST_AUTH_METHOD}]"
echo "password_encryption = '${POSTGRES_HOST_AUTH_METHOD}'" >> "${PGCONF_DIR}/postgresql.conf"
# #DEBUG:
# echo "log_statement = 'all'" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_destination = 'stderr'" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_duration = on" >> "${PGCONF_DIR}/postgresql.conf"
# echo "log_min_messages = debug1" >> "${PGCONF_DIR}/postgresql.conf"

echo "Asked to adjust authentication method to [${POSTGRES_HOST_AUTH_METHOD}] (e.g. for Mapnik's older libpq) (except postgres user, if registered explicitly)"
_CURRENT_POSTGRES_HOST_AUTH_METHOD=$(su - postgres -c "psql -c \"SHOW password_encryption;\"")
if [ "${_CURRENT_POSTGRES_HOST_AUTH_METHOD}" = "${POSTGRES_HOST_AUTH_METHOD}" ]; then
  echo "[POSTGRES_HOST_AUTH_METHOD=${POSTGRES_HOST_AUTH_METHOD}] is already same as the current [${_CURRENT_POSTGRES_HOST_AUTH_METHOD}], no pw auth adjustments are required"
else
# if ! su - postgres -c "psql -c \"select rolpassword from pg_authid where rolname = '${POSTGRES_USER}';\" | grep -E '^md5'" >/dev/null; then
  echo "Applying Mapnik libpq pw [scram-sha-256 -> ${POSTGRES_HOST_AUTH_METHOD}] workaround...."
  su - postgres -c "psql -c \"alter role ${POSTGRES_USER} PASSWORD '${POSTGRES_PASSWORD}';\""
  su - postgres -c "psql -c \"select rolpassword from pg_authid where rolname = '${POSTGRES_USER}';\" | grep -E '^md5'" >/dev/null
  echo "Mapnik libpq pw [scram-sha-256 -> ${POSTGRES_HOST_AUTH_METHOD}] workaround has been applied."
# fi
fi

su - postgres -c "$(which pg_ctl) reload -D ${PGDATA}"
echo "################################################################################"