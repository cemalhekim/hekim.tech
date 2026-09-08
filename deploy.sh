#!/usr/bin/env bash
# Build the site and publish it to asuspro-homeserver, where Caddy serves /srv/data/www
# for https://hekim.tech through the Cloudflare Tunnel. No restart needed: files are served as-is.
set -euo pipefail
cd "$(dirname "$0")"
npm run build
rsync -az --delete dist/ root@asuspro-homeserver:/srv/data/www/
echo "published: https://hekim.tech"
