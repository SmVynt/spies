# Party Spies (Spies)

Multiplayer party game: React frontend, Node/Express API with Socket.IO, MongoDB for room state. Production runs as three Docker Compose services behind nginx.

## Architecture

```text
Browser
   │
   ▼
frontend (nginx:80) ── /api/*, /socket.io/* ──► backend (Node:5000)
                                                    │
                                                    ▼
                                                 mongo (MongoDB 7)
```

| Component | Path / image | Role |
|-----------|----------------|------|
| **mongo** | `mongo:7` | Database (`party-spies` by default) |
| **backend** | `party-spies-back/` | REST API (`/api/rooms/*`), WebSockets |
| **frontend** | `party-spies-front/` | Static SPA; nginx proxies API and Socket.IO to backend |

## Prerequisites

**Production (recommended)**

- Docker Engine with Compose v2 (`docker compose`)
- Git

**Local development (without full stack in Docker)**

- Node.js 18+
- MongoDB 7 (local install, Atlas, or only the `mongo` service from Compose)

## Get the code

```bash
git clone https://github.com/SmVynt/spies.git
cd spies
```

## Configuration

Copy the example env file at the **repo root** (same directory as `docker-compose.yml`):

```bash
cp .env.example .env
```

Edit `.env`. Never commit it (it is in `.gitignore`).

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SK` | Yes | Secret for signing JWTs; use a long random string in production |
| `HTTP_PORT` | No | Host port mapped to frontend nginx (default `80`) |
| `BACKUP_DIR` | No | Mongo dump directory (default `./backups`) |
| `BACKUP_RETENTION_DAYS` | No | Delete dumps older than N days (default `14`) |
| `MONGO_BACKUP_DATABASE` | No | DB name for backups (default: last segment of `MONGO_URI`, or `party-spies`) |

### MongoDB: local vs Atlas

**Recommended on a single VPS (e.g. Hetzner):** use the Compose Mongo service:

```env
MONGO_URI=mongodb://mongo:27017/party-spies
```

The `mongo` hostname only resolves **inside** the Compose network. Do not use that URI from your laptop unless you expose Mongo (not recommended).

**MongoDB Atlas** (or any external host) also works if the backend can reach it:

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/party-spies?retryWrites=true&w=majority
```

Note: `scripts/backup-mongo.sh` dumps from the **local** `mongo` container. For Atlas, use Atlas backups or run `mongodump` against the remote URI yourself.

## Production: Docker Compose

All commands below are run from the repo root.

### Start the stack

```bash
chmod +x scripts/deploy.sh scripts/backup-mongo.sh
./scripts/deploy.sh up
```

This checks for `.env`, builds images, and starts services in the background.

Open the app:

- `http://localhost` (or `http://SERVER_IP`) if `HTTP_PORT=80`
- `http://localhost:8080` if you set `HTTP_PORT=8080`

### Manage the stack

```bash
./scripts/deploy.sh ps          # container status
./scripts/deploy.sh logs        # all logs (follow)
./scripts/deploy.sh logs backend
./scripts/deploy.sh down        # stop and remove containers (keeps mongo volume)
./scripts/deploy.sh redeploy    # down, rebuild images, up --remove-orphans (CI/CD)
./scripts/deploy.sh pull        # pull base images (mongo, node, nginx)
```

Equivalent Compose commands:

```bash
docker compose up -d --build
docker compose logs -f
docker compose down
```

### Redeploy after code changes

```bash
git pull
./scripts/deploy.sh up
```

`up` rebuilds images when Dockerfiles or app code changed.

### Data persistence

Mongo data lives in the Docker volume `mongo_data`. `docker compose down` does **not** remove it. To wipe the database:

```bash
docker compose down -v   # destructive: deletes mongo_data
```

### Access MongoDB

MongoDB runs **inside Docker only** — `docker-compose.yml` does not publish port `27017` on the host. That is intentional: only the `backend` service talks to `mongo` on the internal network.

All commands below are from the **repo root** (e.g. `/opt/spies` on the server).

#### Check that Mongo is running

```bash
./scripts/deploy.sh ps
```

The `mongo` service should be **running** and **healthy**.

#### Open a MongoDB shell

Interactive:

```bash
docker compose exec -it mongo mongosh
```

Non-interactive:

```bash
docker compose exec -T mongo mongosh --quiet
```

Default database name (from `.env.example`) is `party-spies`. In `mongosh`:

```javascript
use party-spies
show collections
db.rooms.find().limit(5).pretty()
db.rooms.countDocuments()
```

Exit with `exit` or `Ctrl+D`.

If your `MONGO_URI` uses a different database name, use that instead of `party-spies` (the segment after the last `/`, before any `?`).

#### One-liner queries

```bash
docker compose exec -T mongo mongosh party-spies --eval 'db.getCollectionNames()'
docker compose exec -T mongo mongosh party-spies --eval 'db.rooms.countDocuments()'
```

#### Other ways to verify the database

| Method | Command |
|--------|---------|
| Backend connected | `docker compose logs backend` — look for `Successfully connected!` |
| Manual backup | `./scripts/backup-mongo.sh` — writes `backups/mongo-*.archive.gz` |
| Data volume | `docker volume inspect spies_mongo_data` (project prefix may vary) |

#### Access from your laptop (optional)

Not enabled by default. For a GUI (e.g. MongoDB Compass), use an **SSH tunnel** — do **not** expose `27017` on the public internet.

On your computer:

```bash
ssh -L 27017:127.0.0.1:27017 root@YOUR_SERVER_IP
```

On the server, temporarily bind Mongo to localhost only — add under `mongo` in `docker-compose.yml`:

```yaml
ports:
  - "127.0.0.1:27017:27017"
```

Then restart the stack (`./scripts/deploy.sh up`). In Compass on your laptop, connect to:

```text
mongodb://127.0.0.1:27017/party-spies
```

Remove the `ports` mapping when you are done, or leave it bound to `127.0.0.1` only.

#### If `mongosh` fails

```bash
docker compose logs mongo
docker compose ps mongo
```

Common causes: stack not running (`./scripts/deploy.sh up`), `mongo` still starting (wait for healthy), wrong database name in `MONGO_URI`.


### 1. Generate an SSH key (on your computer)

Do this **before** creating the server, on the machine you will use to log in (Linux, macOS, or WSL on Windows).

Check whether you already have a key:

```bash
ls -la ~/.ssh/*.pub
```

If you do not have one (or want a dedicated key for this server), create an Ed25519 key:

```bash
ssh-keygen -t ed25519 -C "hetzner-spies" -f ~/.ssh/hetzner_spies
```

- When prompted for a passphrase, you can press Enter for none, or set one for extra security (you will type it when connecting).
- This creates:
  - `~/.ssh/hetzner_spies` — **private** key (never share or upload)
  - `~/.ssh/hetzner_spies.pub` — **public** key (safe to give to Hetzner)

Show the public key and copy it:

```bash
cat ~/.ssh/hetzner_spies.pub
```

The line looks like `ssh-ed25519 AAAA... hetzner-spies`.

**Optional — default key instead of a named file:**

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

That stores keys as `~/.ssh/id_ed25519` and `~/.ssh/id_ed25519.pub`. Hetzner and `ssh` will find them automatically.

### 2. Add the key in Hetzner Cloud

1. Open [Hetzner Cloud Console](https://console.hetzner.cloud/) → your project.
2. Go to **Security** → **SSH keys** (or use **Add SSH key** on the create-server screen).
3. Click **Add SSH key**.
4. Paste the full contents of your `.pub` file (one line).
5. Name it (e.g. `laptop` or `wsl`) and save.

You can reuse the same key for multiple servers.

### 3. Create the server

In [Hetzner Cloud Console](https://console.hetzner.cloud/):

1. **Create Server** → Ubuntu 24.04 (or similar).
2. **Type:** e.g. Cost-Optimized **CX23** (2 vCPU, 4 GB RAM) is enough for this stack.
3. **Location:** e.g. Nuremberg / Falkenstein / Helsinki.
4. **SSH keys:** select the key you added in step 2 (required — without it you cannot log in securely).
5. **Networking:** IPv4 (+ IPv6 optional).
6. Create the server and note the public IPv4.

### 4. Connect and initial server setup

From your computer (use `-i` if you used a non-default key file):

```bash
ssh -i ~/.ssh/hetzner_spies root@YOUR_SERVER_IP
```

First connection may ask to confirm the host fingerprint — type `yes`.

On the server:

```bash
apt update && apt upgrade -y
apt install -y git ca-certificates curl
curl -fsSL https://get.docker.com | sh
```

Optional:

```bash
timedatectl set-timezone Europe/Berlin
```

**Optional — easier logins:** add to `~/.ssh/config` on your computer:

```sshconfig
Host spies-hetzner
  HostName YOUR_SERVER_IP
  User root
  IdentityFile ~/.ssh/hetzner_spies
```

Then connect with:

```bash
ssh spies-hetzner
```

### 5. GitHub access on the server

GitHub does **not** accept your account password for `git clone` / `git pull`. Use an **SSH key on the server** (separate from the key you use to SSH into Hetzner).

On the server:

```bash
ssh-keygen -t ed25519 -C "hetzner-github" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub
```

Add the printed line in GitHub → **Settings** → **SSH and GPG keys** → **New SSH key** (or add as a read-only **Deploy key** on this repository, if it is private).

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat >> ~/.ssh/config <<'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
ssh -T git@github.com
```

Clone this repo over SSH (use your fork or org URL):

```bash
mkdir -p /opt/spies
cd /opt/spies
git clone git@github.com:SmVynt/spies.git .
```

If the repository is **private**, the server needs a GitHub SSH key that can read it (steps above). For a **public** repo you can use HTTPS instead:

```bash
git clone https://github.com/SmVynt/spies.git .
```

### 6. Install the app

If the repo is not cloned yet, see step 5. Otherwise:

```bash
cd /opt/spies
cp .env.example .env
nano .env   # set JWT_SK and MONGO_URI=mongodb://mongo:27017/party-spies
chmod +x scripts/deploy.sh scripts/backup-mongo.sh
./scripts/deploy.sh up
```

Verify:

```bash
./scripts/deploy.sh ps
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1/
```

### 7. Firewall

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp   # when you add HTTPS
ufw enable
```

You can also attach a [Hetzner Cloud Firewall](https://docs.hetzner.com/cloud/firewalls/overview/) allowing the same ports.

### 8. Domain and HTTPS (optional)

1. Point your domain’s **A record** to the server IPv4.
2. Terminate TLS on the host (Caddy, nginx + Certbot, etc.) and proxy to `127.0.0.1:80`, **or** extend the frontend/nginx setup to handle certificates.

The Compose frontend already proxies `/api/` and `/socket.io/` to the backend; you only need TLS at the edge.

### 9. Scheduled Mongo backups

With local Compose Mongo:

```bash
./scripts/deploy.sh install-cron
```

This installs `/etc/cron.d/spies-mongo-backup` (daily at 03:00). Logs: `/var/log/spies-mongo-backup.log`.

Remove:

```bash
./scripts/deploy.sh uninstall-cron
```

Run a backup manually:

```bash
./scripts/backup-mongo.sh
```

Dumps are written to `backups/mongo-<db>-<timestamp>.archive.gz` (or `BACKUP_DIR`).

### Restore from a backup

With the stack running and `mongo` healthy:

```bash
gunzip -c backups/mongo-party-spies-YYYYMMDD-HHMMSS.archive.gz \
  | docker compose exec -T mongo mongorestore --archive --gzip --drop
```

Adjust the filename and database name as needed. `--drop` replaces existing collections in the target DB.

## CI/CD (GitHub Actions)

### Continuous integration + automatic deploy

Workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes and pull requests to `main`:

1. **Frontend** — `npm ci`, `npm run lint`, `npm run build`
2. **Backend** — `npm ci`, `node --check` on all project `.js` files
3. **Docker** — `docker compose build` (uses dummy `JWT_SK` only for Compose interpolation)
4. **Deploy** (only on **`push`** to **`main`**, and only after the steps above succeed): SSH into your Hetzner box, then [`scripts/git-sync-for-deploy.sh`](scripts/git-sync-for-deploy.sh) (`git fetch`, `reset --hard` to `origin/main`, `git clean -fd`), then `./scripts/deploy.sh redeploy` → `docker compose down`, then `docker compose up -d --build --remove-orphans` (Mongo **named volume** `mongo_data` is kept). Ignored paths like **`.env`** and **`backups/`** are left as-is (`git clean` without `-x`).

Deploy runs by default once `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, and variable `DEPLOY_PATH` are set. To **disable** automatic deploys without removing secrets, set repository variable **`DEPLOY_ENABLED`** to `false`.

### Manual deploy workflow

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) is **manual only** (Actions → **Deploy** → **Run workflow**). It runs the same SSH script as step 4 (no need to set `DEPLOY_ENABLED`).

### GitHub configuration

| Kind | Name | Purpose |
|------|------|---------|
| Secret | `DEPLOY_HOST` | Server hostname or IP |
| Secret | `DEPLOY_USER` | SSH user (e.g. `root` or deploy user) |
| Secret | `DEPLOY_SSH_KEY` | Private key (PEM) for that user — paste full key including `BEGIN`/`END` lines |
| Variable | `DEPLOY_PATH` | Absolute path to the clone on the server (e.g. `/opt/spies`) |
| Variable | `DEPLOY_ENABLED` | Optional: set to `false` to skip the automatic deploy job on `main` |

The server must already have Docker, a root **`.env`**, and a clone of this repo that the key can `git fetch` from (SSH access to GitHub from the server is unchanged).

SSH uses the default port **22**. For another port, extend the workflow with the `port` input on [`appleboy/ssh-action`](https://github.com/appleboy/ssh-action).

## Local development

### Option A: Full stack in Docker (closest to production)

```bash
cp .env.example .env
# edit JWT_SK; keep MONGO_URI=mongodb://mongo:27017/party-spies
./scripts/deploy.sh up
```

Rebuild after frontend/backend edits:

```bash
./scripts/deploy.sh up
```

### Option B: Native Node + Mongo

**Terminal 1 — MongoDB**

Run Mongo locally, or start only the database container:

```bash
docker compose up -d mongo
```

Use a URI that reaches that instance, e.g.:

```env
MONGO_URI=mongodb://127.0.0.1:27017/party-spies
```

**Terminal 2 — backend**

```bash
cd party-spies-back
cp ../.env.example .env   # or symlink ../.env
# set MONGO_URI and JWT_SK in party-spies-back/.env
npm install
npm start                 # nodemon on port 5000
```

**Terminal 3 — frontend**

```bash
cd party-spies-front
npm install
npm run dev               # Vite on http://localhost:3000
```

Vite proxies `/api` to `http://localhost:5000` (see `party-spies-front/vite.config.js`). Socket.IO in dev may need the same origin as production (`/socket.io/` via a proxy) if you add real-time features that use it.

### Backend-only utilities

Load sample tasks into Mongo (requires `MONGO_URI` in env and a `Task` model in the DB):

```bash
cd party-spies-back
node loadTasks.js
```

## Project layout

```text
spies/
├── .github/
│   └── workflows/         # CI + post-push Hetzner deploy (optional)
├── docker-compose.yml      # mongo, backend, frontend
├── .env.example            # template for root .env
├── scripts/
│   ├── deploy.sh               # up | redeploy | down | logs | ps | pull | install-cron
│   ├── git-sync-for-deploy.sh  # fetch + reset --hard + clean (VPS deploy)
│   ├── backup-mongo.sh         # mongodump from compose mongo
│   └── cron/               # example cron.d snippet
├── party-spies-back/       # Express API
└── party-spies-front/      # React + Vite SPA
```

## Troubleshooting

| Symptom | Things to check |
|---------|------------------|
| `Missing .env` on `deploy.sh up` | `cp .env.example .env` and set `JWT_SK` |
| Backend exits / “Connectivity error” | `MONGO_URI` correct; `mongo` healthy (`docker compose ps`) |
| Site loads but API fails | `docker compose logs backend`; nginx proxies `/api/` to `backend:5000` |
| Port 80 in use | Set `HTTP_PORT=8080` in `.env` and reopen on that port |
| Backup skips | Stack must be up; backup script uses `docker compose exec mongo` |

Useful commands:

```bash
docker compose ps
docker compose logs -f backend mongo frontend
docker compose exec mongo mongosh party-spies --eval 'db.rooms.countDocuments()'
```

## Security notes

- Use a strong, unique `JWT_SK` in production.
- Do not expose the `mongo` port to the internet; only the backend talks to it on the internal Docker network.
- Keep `.env` out of git and out of chat/logs.
- Restrict VPS firewall to SSH, HTTP, and HTTPS.
- Rotate credentials if they were ever shared or committed.

## License

See the repository (or add a `LICENSE` file) for terms.
