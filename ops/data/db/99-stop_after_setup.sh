#!/bin/sh

set -e

echo "OLD: kartoza/postgis image" source /scripts/env-data.sh

echo "PGDATA = [${PGDATA:?missing PGDATA}]"

echo "Setup is done. Exit."
pg_ctl -D "${PGDATA}" stop -m smart || true
echo "Done."
