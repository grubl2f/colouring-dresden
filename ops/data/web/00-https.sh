#!/bin/sh

CERT_DIR="/etc/nginx/ssl/${PUB_ROOT_DOMAIN}"
CERT="${CERT_DIR}/cert.pem"
KEY="${CERT_DIR}/key.pem"
CERT_DETAILS="/C=${CERT_C:-}/ST=${CERT_ST:-}/L=${CERT_L:-}/O=${CERT_O:-}/CN=${CERT_CN:-}"

if [ ! -f "${CERT}" ] || [ ! -f "${KEY}" ]; then
  mkdir -p "${CERT_DIR}" \
  && openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -keyout "${KEY}" -out "${CERT}" -days 365 -nodes -subj "${CERT_DETAILS}"
fi

# nginx -s reload
