#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env in ${ROOT}" >&2
  echo "Create it from the example file, then edit JWT_SK and any overrides." >&2
  exit 1
fi

COMPOSE="${COMPOSE:-docker compose}"
MODE="${1:-up}"

case "$MODE" in
  up)
    $COMPOSE up -d --build
    echo "Stack is up. Open the site on this machine’s port from HTTP_PORT in .env (default 80), or use your server’s IP or domain."
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
  *)
    echo "Usage: $0 [up|down|logs|ps|pull]" >&2
    echo "  up    — build images and start (default)" >&2
    echo "  down  — stop and remove containers" >&2
    echo "  logs  — follow logs (optional service name)" >&2
    echo "  ps    — container status" >&2
    echo "  pull  — pull base images (mongo, node, nginx)" >&2
    exit 1
    ;;
esac
