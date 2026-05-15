#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

COMPOSE="${COMPOSE:-docker compose}"
MODE="${1:-up}"

if [[ "$MODE" == "up" || "$MODE" == "redeploy" ]]; then
  if [[ ! -f .env ]]; then
    echo "Missing .env in ${ROOT}" >&2
    echo "Create it from the example file, then edit JWT_SK and any overrides." >&2
    exit 1
  fi
fi

case "$MODE" in
  up)
    $COMPOSE up -d --build
    echo "Stack is up. Open the site on this machine’s port from HTTP_PORT in .env (default 80), or use your server’s IP or domain."
    ;;
  redeploy)
    # Stop and remove containers, rebuild images, start fresh (suited for CI/CD on a VPS).
    # Named volumes (e.g. mongo_data) are kept.
    $COMPOSE down
    $COMPOSE up -d --build --remove-orphans
    echo "Stack recreated. Data volume mongo_data was not removed."
    ;;
  down)
    $COMPOSE down
    ;;
  logs)
    $COMPOSE logs -f "${2:-}"
    ;;
  ps)
    $COMPOSE ps
    ;;
  pull)
    $COMPOSE pull
    ;;
  install-cron)
    CRON_NAME="spies-mongo-backup"
    CRON_DST="/etc/cron.d/${CRON_NAME}"
    LOG="/var/log/${CRON_NAME}.log"
    TMP="$(mktemp)"
    trap 'rm -f "$TMP"' EXIT

    chmod +x "${ROOT}/scripts/backup-mongo.sh"

    {
      echo "# Mongo backup — installed by ${ROOT}/scripts/deploy.sh install-cron"
      echo "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
      echo "SHELL=/bin/sh"
      echo ""
      printf '0 3 * * * root cd %q && %q/scripts/backup-mongo.sh >> %q 2>&1\n' "$ROOT" "$ROOT" "$LOG"
    } >"$TMP"

    sudo install -m 644 "$TMP" "$CRON_DST"
    sudo touch "$LOG"
    echo "Installed ${CRON_DST} (daily 03:00, logs to ${LOG})."
    echo "Ensure .env exists in ${ROOT} before the job runs (backup script needs it)."
    ;;
  uninstall-cron)
    sudo rm -f /etc/cron.d/spies-mongo-backup
    echo "Removed /etc/cron.d/spies-mongo-backup (log file left at /var/log/spies-mongo-backup.log)."
    ;;
  *)
    echo "Usage: $0 [up|redeploy|down|logs|ps|pull|install-cron|uninstall-cron]" >&2
    echo "  up              — build images and start (default)" >&2
    echo "  redeploy        — compose down, then up -d --build --remove-orphans" >&2
    echo "  down            — stop and remove containers" >&2
    echo "  logs            — follow logs (optional service name)" >&2
    echo "  ps              — container status" >&2
    echo "  pull            — pull base images (mongo, node, nginx)" >&2
    echo "  install-cron    — sudo: daily mongo backup via /etc/cron.d/spies-mongo-backup" >&2
    echo "  uninstall-cron  — sudo: remove that cron.d file" >&2
    exit 1
    ;;
esac
