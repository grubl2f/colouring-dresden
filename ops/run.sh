#!/bin/bash

# cd /path/to/colouring-dresden/
# cd ./ops/
# unset COMPOSE_PROJECT_NAME MIGRATIONS_DIR_SRC APP_CONTAINER_IMAGE WEB_DOMAIN_NAME APP_DOMAIN_NAME DB_DOMAIN_NAME NETNAME

export COMPOSE_PROJECT_NAME=col-dd
export MIGRATIONS_DIR_SRC=../migrations
export APP_CONTAINER_IMAGE=colouring-dresden
export DOMAIN_NAME=${COMPOSE_PROJECT_NAME}
export WEB_DOMAIN_NAME=web.${DOMAIN_NAME}
export APP_DOMAIN_NAME=app.${DOMAIN_NAME}
export DB_DOMAIN_NAME=db.${DOMAIN_NAME}
# network name: "default" for docker, "podman" for podman
export NETNAME=$(if which podman > /dev/null; then echo podman; else echo default; fi)

# echo "full cleanup"
# docker-compose --file=./compose.yaml down
# docker volume rm "${COMPOSE_PROJECT_NAME}_db-data"
# # docker volume prune

docker-compose --file=./compose.yaml up --always-recreate-deps --renew-anon-volumes

# unset COMPOSE_PROJECT_NAME MIGRATIONS_DIR_SRC APP_CONTAINER_IMAGE WEB_DOMAIN_NAME APP_DOMAIN_NAME DB_DOMAIN_NAME NETNAME
# cd -