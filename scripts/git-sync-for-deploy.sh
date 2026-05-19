#!/usr/bin/env bash
# Make the working tree match origin (for deploy-only VPS).
# Does not remove gitignored untracked files (e.g. .env, backups/).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BRANCH="${GIT_DEPLOY_BRANCH:-main}"

git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd

echo "Synced to origin/${BRANCH}"
