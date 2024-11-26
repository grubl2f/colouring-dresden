#!/bin/sh


source /scripts/env-data.sh


echo "PGDATA = [${PGDATA:?missing PGDATA}]"


echo "Setup is done. Exit."
su - postgres -c "$(which pg_ctl) -D ${PGDATA} -m fast -w stop"
echo "Done."