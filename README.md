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

Git submodules:

- `party-spies-front` — https://github.com/SmVynt/party-spies-front.git
- `party-spies-back` — https://github.com/SmVynt/party-spies-back.git

## Prerequisites

**Production (recommended)**

- Docker Engine with Compose v2 (`docker compose`)
- Git

**Local development (without full stack in Docker)**

- Node.js 18+
- MongoDB 7 (local install, Atlas, or only the `mongo` service from Compose)

## Get the code

Clone with submodules:

```bash
git clone --recurse-submodules https://github.com/YOUR_ORG/spies.git
cd spies
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

Update submodules later:

```bash
git submodule update --remote --merge
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
git submodule update --remote --merge
./scripts/deploy.sh up
```

`up` rebuilds images when Dockerfiles or app code changed.

### Data persistence

Mongo data lives in the Docker volume `mongo_data`. `docker compose down` does **not** remove it. To wipe the database:

```bash
docker compose down -v   # destructive: deletes mongo_data
```

## Deploy on Hetzner (or any Linux VPS)

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

If you used the default `~/.ssh/id_ed25519`:

```bash
ssh root@YOUR_SERVER_IP
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

Add the printed line in GitHub → **Settings** → **SSH and GPG keys** → **New SSH key** (or add as a read-only **Deploy key** on each private repo).

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

Submodule URLs in this repo use SSH (`git@github.com:...`). Clone with SSH, not HTTPS:

```bash
mkdir -p /opt/spies
cd /opt/spies
git clone --recurse-submodules git@github.com:SmVynt/spies.git .
```

If you already cloned the parent repo but submodules failed with `Username for 'https://github.com'`, either pull the latest `.gitmodules` (SSH URLs) or on the server run:

```bash
git config --global url."git@github.com:".insteadOf "https://github.com/"
cd /opt/spies
git submodule sync --recursive
git submodule update --init --recursive
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
├── docker-compose.yml      # mongo, backend, frontend
├── .env.example            # template for root .env
├── scripts/
│   ├── deploy.sh           # up | down | logs | ps | pull | install-cron
│   ├── backup-mongo.sh     # mongodump from compose mongo
│   └── cron/               # example cron.d snippet
├── party-spies-back/       # Express API (submodule)
└── party-spies-front/      # React + Vite SPA (submodule)
```

## Troubleshooting

| Symptom | Things to check |
|---------|------------------|
| `Missing .env` on `deploy.sh up` | `cp .env.example .env` and set `JWT_SK` |
| Backend exits / “Connectivity error” | `MONGO_URI` correct; `mongo` healthy (`docker compose ps`) |
| Site loads but API fails | `docker compose logs backend`; nginx proxies `/api/` to `backend:5000` |
| Port 80 in use | Set `HTTP_PORT=8080` in `.env` and reopen on that port |
| Backup skips | Stack must be up; backup script uses `docker compose exec mongo` |
| Submodule dirs empty | `git submodule update --init --recursive` |

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

See submodule repositories for frontend/backend licensing if applicable.
