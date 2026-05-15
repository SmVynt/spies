# Party Spies

React + Vite frontend, Node/Express + Socket.IO backend, MongoDB. Production: **Docker Compose** (mongo, backend, nginx static + API proxy).

```
Browser → frontend:80 → /api, /socket.io → backend:5000 → mongo:27017
```

| Service | Path / image |
|---------|----------------|
| mongo | `mongo:7`, volume `mongo_data` |
| backend | `party-spies-back/` |
| frontend | `party-spies-front/` (nginx) |

## Requirements

- **Prod:** Docker with Compose v2 (`docker compose`), Git  
- **Local:** Node 18+, MongoDB (or `docker compose up -d mongo`)

## Quick start (production)

```bash
git clone https://github.com/SmVynt/spies.git && cd spies
cp .env.example .env   # set JWT_SK; VPS: MONGO_URI=mongodb://mongo:27017/party-spies
chmod +x scripts/deploy.sh scripts/backup-mongo.sh scripts/git-sync-for-deploy.sh
./scripts/deploy.sh up
```

Open `http://localhost` (or `http://SERVER:HTTP_PORT`). **`docker compose down`** keeps the DB volume; **`down -v`** wipes it.

### `.env` (repo root)

| Variable | Notes |
|----------|--------|
| `MONGO_URI` | Required. On Compose VPS: `mongodb://mongo:27017/party-spies`. Atlas: full SRV string. |
| `JWT_SK` | Required in prod. |
| `HTTP_PORT` | Host → frontend (default `80`) |
| `BACKUP_DIR`, `BACKUP_RETENTION_DAYS`, `MONGO_BACKUP_DATABASE` | Optional; see `scripts/backup-mongo.sh` |

Mongo is **not** published on `27017` by default. For Compass, use an SSH tunnel — don’t expose Mongo publicly.

### Common commands

```bash
./scripts/deploy.sh ps | logs | logs backend | down | redeploy | pull
docker compose exec -it mongo mongosh party-spies
./scripts/backup-mongo.sh
./scripts/deploy.sh install-cron    # daily mongodump → backups/ (sudo)
```

Restore (example):

```bash
gunzip -c backups/mongo-party-spies-….archive.gz | docker compose exec -T mongo mongorestore --archive --gzip --drop
```

## VPS (e.g. Hetzner)

1. Ubuntu + [Docker install](https://docs.docker.com/engine/install/), Git.  
2. SSH key in Hetzner; firewall: **22, 80** (443 if you add TLS).  
3. Clone repo; GitHub: [server SSH key or HTTPS](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) for `git fetch`.  
4. `cp .env.example .env`, edit, `./scripts/deploy.sh up`.  
5. Optional: TLS (Caddy/nginx) → reverse proxy to `127.0.0.1:80`.  
6. **Deploy from GitHub:** configure [Actions secrets and variables](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository) (see table below).

**Merge error on deploy** (“untracked files would be overwritten”): on the server once:

`git fetch origin && git checkout main && git reset --hard origin/main && git clean -fd`

(Ignored files like `.env` stay.) Then use [`scripts/git-sync-for-deploy.sh`](scripts/git-sync-for-deploy.sh) from CI as usual.

## CI/CD

### GitHub Actions — secrets & variables

Create under **Settings → Secrets and variables → Actions**.

**Secrets** (name must match exactly):

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | Server hostname or IP (SSH target). |
| `DEPLOY_USER` | SSH user (e.g. `root` or deploy user). |
| `DEPLOY_SSH_KEY` | **Private** SSH key (full PEM, including `BEGIN`/`END` lines). The matching **public** key must be in `~/.ssh/authorized_keys` on the server for `DEPLOY_USER`. |

**Variables:**

| Variable | Required | Description |
|----------|----------|-------------|
| `DEPLOY_PATH` | Yes | Absolute path to the repo clone on the server (e.g. `/opt/spies`). The deploy job runs `cd` here before `git-sync-for-deploy.sh` and `deploy.sh`. |
| `DEPLOY_ENABLED` | No | Set to `false` to **skip** the automatic deploy job on pushes to `main` (CI still runs). If unset or any other value, auto-deploy runs when secrets are set. |

Default SSH port is **22**. For another port, add `port` to [`appleboy/ssh-action`](https://github.com/appleboy/ssh-action) in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) / [`deploy.yml`](.github/workflows/deploy.yml).

### Workflows

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — on PR/push `main`: frontend lint+build, backend `npm ci` + syntax check, `docker compose build`; on **push** to **main** (unless `DEPLOY_ENABLED=false`): SSH → `git-sync-for-deploy.sh` → `deploy.sh redeploy`.  
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — manual **Deploy** only (same SSH steps).

The server must have Docker, a root **`.env`**, and outbound access so `git fetch` works from that clone.

## Local development

**All in Docker:** same as Quick start with `.env`.

**Hybrid:** `docker compose up -d mongo`, `MONGO_URI=mongodb://127.0.0.1:27017/party-spies`, then `npm install && npm start` in `party-spies-back`, `npm install && npm run dev` in `party-spies-front` (Vite proxies `/api`).

Load tasks helper: `cd party-spies-back && node loadTasks.js` (needs `MONGO_URI`).

## Layout

```
spies/
├── docker-compose.yml
├── .env.example
├── .github/workflows/
├── scripts/   deploy.sh, git-sync-for-deploy.sh, backup-mongo.sh, cron/
├── party-spies-back/
└── party-spies-front/
```

## Troubleshooting

| Issue | Hint |
|-------|------|
| Missing `.env` / JWT | `cp .env.example .env` |
| Backend DB error | `MONGO_URI`, `docker compose ps` (mongo healthy) |
| Port 80 busy | `HTTP_PORT=8080` in `.env` |
| CI deploy git error | One-time server sync + `git clean -fd` (see VPS above) |

## Security

Strong `JWT_SK`, keep `.env` private, don’t expose Mongo on the internet, firewall SSH/HTTP/HTTPS.

