# DevOps

## Environment

### VM

- `qemu`/`libvirt`
  - `7.2.8`
- min 3Gb RAM for `npm run build` and stable network for `npm install`

- `linux`
  - fedora `40`
  - kernel `6.8.7`

### Podman

- `podman`
  - rootless
  - 5.1.0
- `podman-compose`
  - 1.1.0
- `podman compose`
  - via docker socket and plugin

#### Install

``` bash
sudo dnf -y install podman podman-compose
```

> for the Docker Compose plugin see the `Docker:Install`

### Docker

- `docker`
  - rootless
  - 26.1.4
- `docker compose`
  
#### Install

``` bash
sudo dnf --repofrompath 'docker,https://download.docker.com/linux/fedora/$releasever/$basearch/stable' --setopt=docker.gpgcheck=1 --setopt=docker.gpgkey=https://download.docker.com/linux/fedora/gpg -y install shadow-utils fuse-overlayfs iptables docker-ce-rootless-extras
```

### Files

``` bash
tree -a
.
├── compose.yaml                   # "podman-compose", "podman compose", "docker compose" 
├── Containerfile                  # node app image
├── data
│   ├── db
│   │   └── 00-migrations.sh       # db migrations
│   └── web
│       ├── 00-https.sh            # nginx cert generation
│       ├── nginx.conf.template    # nginx default.conf
│       └── ssl
│           ├── cert.pem           # custom certificate (disables 00-https.sh certificate generation, not included)
│           └── key.pem            # custom certificate key (disables 00-https.sh certificate generation, not included)
├── .env                           # environment variables for the setup 
└── README.md
```

### Run

> all commands run under regular user (no root/sudo)

#### Podman-Compose

`podman-compose --podman-build-args="--build-context=app=../app" up`
  
- `--podman-build-args="--build-context=app=../app"` - workaround, until the next release with [Support `additional_contexts` #762](https://github.com/containers/podman-compose/issues/762) merged

#### Podman Compose with Docker Compose plugin

`podman compose up`

#### Docker Compose (with Docker Compose plugin)

`podman compose up`

### Troubleshooting, exploring

`podman-compose --podman-build-args="--no-cache --build-context=app=../app" --podman-run-args="--replace" up`

- `--no-cache` to bypass the image cache
- `--podman-run-args="--replace"` to replace containers and pods every new run
- `--build` to force build images before running containers

- in `compose.yaml` uncomment the `app`'s `command: ["npm", "run", "start"]` to run in development mode

### In browser

- enable cookies
- accessible
  - local machine
    - `https://localhost:8443`
  - remote machine
    - `https://<machine-ip/domain>:8443`

  > `8443` instead of `443` because of the rootless context (otherwise requires setting `sudo sysctl -w net.ipv4.ip_unprivileged_port_start=443`)
  - `TODO`
    - test `localhost:3001` redirect in dev mode
    - check remote domain names (when running on remote machine)

### Misc

- `node:20-slim` base image choice:
  - not `node:18-slim` or `node:16-slim`, since they are quite old and updates will be required anyway for newer `npm` packages/tools
    - up until now no marginal issues for the basic services (`nginx`,`app`,`postgres`) (manully tested)
  - not `node:20-alpine`, since it requires `libc` not `musl` for `mapnik-node` plugin
  - not `node:22-slim`, since there is `mapnik-node` issue with the current version (see [node-mapnik segfaults on node 20.12 onwards #995](https://github.com/mapnik/node-mapnik/issues/995))

- `podman-compose` has advantages over `docker/docker compose`:

  - rootless by default
  - groups containers in the project's pod: `podman pod ls`
  - allows to generate k8s kube and deployment specs
    - `TODO:test`
  - drawbacks:
    - compose-spec support not always in sync with the current version/features (see current workaround for [Support `additional_contexts` #762](https://github.com/containers/podman-compose/issues/762))

### TODO

- db migrations
  - review migrations adjustments (workarounds)
    - `055.migration_new_building_geoemtries_part1.up.sql`
    - `056.migration_new_building_geoemtries_part2.up.sql`
  - test with non-empty migrations
  - generate synthetic data for tests
- `Containerfile`
  - make `NODE_OPTIONS`'s `--openssl-legacy-provider` workaround conditional on node image version
- CI/CD
  - `Packer`/`Vagrant`
  - `Terraform`
- `k8s`
  - `Helm` chart
- test, test, test!
- local/offline mirror (or pre-cache) with the `apt-get`, `npm` and other packages to reduce the image build time and improve repeatability

### UPDATE (DEV) 11.2024

``` bash
# VARIABLES:
#
# subdomain:
#   COMPOSE_PROJECT_NAME=colouring-dresden-test2
#
# "root" domain (for reverse proxy: see ./ops/data/web/nginx.conf.template):
#   PUB_ROOT_DOMAIN=my-public-domain.de 
#
# full public domain name of the deployment
#   echo "${COMPOSE_PROJECT_NAME}.${PUB_ROOT_DOMAIN}"
#

# ./compose.proxy.yaml:
#   - local reverse proxy with certificates (either public or self-generated), if required (commented out)
#   - the app itself runs over http (TODO)

# UP
#env COMPOSE_PROJECT_NAME=colouring-dresden-test2 PUB_ROOT_DOMAIN=my-public-domain.de podman-compose --file=./compose.proxy.yaml up -d -t 0 --always-recreate-deps --renew-anon-volumes
env COMPOSE_PROJECT_NAME=colouring-dresden-test2 podman-compose --file=./compose.yaml up -d -t 0 --always-recreate-deps --renew-anon-volumes
# connect to a global reverse proxy nginx container
podman network connect colouring-dresden-test2.cld-net nginx

# DOWN
#env COMPOSE_PROJECT_NAME=colouring-dresden-test2 PUB_ROOT_DOMAIN=my-public-domain.de podman-compose --file=./compose.proxy.yaml down -t 0
env COMPOSE_PROJECT_NAME=colouring-dresden-test2 podman-compose --file=./compose.yaml down -d -t 0
# connect to a global reverse proxy nginx container
podman network disconnect colouring-dresden-test2.cld-net nginx

##################
# DELETE DB VOLUME (TO REINIT DB ON NEW COMPOSE UP)
podman volume rm colouring-dresden-test2.cld-vol-db-data

# REMOVE DANGLING VOLUMES
podman volume prune
```
