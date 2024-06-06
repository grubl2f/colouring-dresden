#!/bin/sh

mkdir -p /etc/nginx/ssl/
cd /etc/nginx/ssl/ || exit 1
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=/ST=/L=/O=/CN="
cd - || exit 0

# nginx -s reload