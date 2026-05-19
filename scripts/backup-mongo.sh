#!/usr/bin/env bash
# Dump MongoDB from the compose `mongo` service to a gzipped archive on the host.
# Intended for cron (see scripts/cron/spies-mongo-backup).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

COMPOSE="${COMPOSE:-docker compose}"
BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

# Database name: explicit override, or last path segment of MONGO_URI, or default
DB_NAME="${MONGO_BACKUP_DATABASE:-}"
if [[ -z "$DB_NAME" && -n "${MONGO_URI:-}" ]]; then
  DB_NAME="${MONGO_URI##*/}"
  DB_NAME="${DB_NAME%%\?*}"
fi
DB_NAME="${DB_NAME:-party-spies}"

if ! $COMPOSE exec -T mongo true >/dev/null 2>&1; then
  echo "$(date -Iseconds) mongo container is not running or not reachable; skip backup" >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/mongo-${DB_NAME}-${STAMP}.archive.gz"

echo "$(date -Iseconds) backing up database ${DB_NAME} -> ${OUT}"
$COMPOSE exec -T mongo mongodump --db="$DB_NAME" --archive --gzip >"$OUT"

# Drop archives older than RETENTION_DAYS
if [[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]] && [[ "$RETENTION_DAYS" -gt 0 ]]; then
  find "$BACKUP_DIR" -maxdepth 1 -name 'mongo-*.archive.gz' -type f -mtime "+${RETENTION_DAYS}" -delete || true
fi

echo "$(date -Iseconds) done"
