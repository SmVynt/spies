# Party Spies

A free, multiplayer web party game of secret missions.

Players draw mission cards at the start of an evening and try to complete them in person — convince someone to imitate a celebrity, swap two pieces of furniture undetected, use the same phrase four times during the night — without anyone noticing. Whoever finishes the most missions wins. In your browser, on your phones, with friends.

**Play it:** <https://partyspies.com>

## How it works

1. One player creates a room from the landing page.
2. Everyone else joins on their phone via the share link.
3. Each player gets a hand of secret missions, drawn from themed packs.
4. Throughout the evening, players mark missions complete in the app when they pull them off. Points are awarded by difficulty.
5. The leaderboard updates live for everyone over WebSockets.

The game is best played with **at least 4 people**, in person, with phones out only briefly. The browser is the scoreboard and task tracker — the actual play happens off-screen at your gathering.

## Tech stack

| Layer    | Stack |
|----------|-------|
| Frontend | React, Vite, Tailwind CSS, react-i18next (en/de/ru) |
| Backend  | Node.js, Express, Socket.IO, Mongoose |
| Database | MongoDB |
| Infra    | Docker Compose (3 services), nginx as static host + API/Socket.IO proxy |

```
Browser → nginx (80) ──/api, /socket.io──→ Node backend (5000) → MongoDB
```

| Service  | Image / path                            |
|----------|-----------------------------------------|
| mongo    | `mongo:7`, named volume `mongo_data`    |
| backend  | `party-spies-back/`                     |
| frontend | `party-spies-front/` (nginx)            |

## Run it locally (Docker)

Fastest path to a working copy on your machine:

```bash
git clone https://github.com/SmVynt/spies.git
cd spies
cp .env.example .env
# Edit .env: set JWT_SK to any long random string. Leave MONGO_URI as the default.
./scripts/deploy.sh up
```

Open <http://localhost> in your browser.

To stop the stack: `docker compose down` (keeps the database volume). To wipe everything including the database: `docker compose down -v`.

## Run it locally (hybrid, for development)

For hot-reload while hacking on the code, run Mongo in a container and the two apps directly on the host.

**1. Start a development Mongo** with port 27017 published to localhost:

```bash
docker run -d --name spies-mongo -p 27017:27017 -v spies_mongo_dev:/data/db mongo:7
```

**2. Backend.** Create `party-spies-back/.env` with the dev values:

```
MONGO_URI=mongodb://127.0.0.1:27017/party-spies
JWT_SK=dev-secret
```

Then in `party-spies-back/`:

```bash
npm install
npm start
```

**3. Frontend.** In a separate terminal:

```bash
cd party-spies-front
npm install
npm run dev
```

Open <http://localhost:3000>. Vite proxies `/api` to the backend on port 5000.

Optional: pre-load sample tasks into Mongo:

```bash
cd party-spies-back && node loadTasks.js
```

When you're done, stop the dev Mongo:

```bash
docker stop spies-mongo && docker rm spies-mongo
```

## Self-host on a VPS

Tested on Ubuntu 22.04 with Docker. Should work on any Linux box that can run `docker compose v2`.

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git

git clone https://github.com/SmVynt/spies.git /opt/spies
cd /opt/spies
cp .env.example .env
# Edit .env — set a long random JWT_SK.

./scripts/deploy.sh up
```

Open ports **80** (and **443** if you add TLS) on your firewall. Mongo is **not** published on the public internet — it's only reachable from the backend container on the internal Docker network.

### Optional: automated daily backups

```bash
./scripts/deploy.sh install-cron     # daily 03:00 mongodump → backups/
./scripts/backup-mongo.sh             # manual backup right now
```

Restore from an archive:

```bash
gunzip -c backups/mongo-party-spies-….archive.gz \
  | docker compose exec -T mongo mongorestore --archive --gzip --drop
```

## Configuration (`.env`)

| Variable                | Required | Notes |
|-------------------------|----------|-------|
| `JWT_SK`                | Yes      | Long random string for signing auth tokens. |
| `MONGO_URI`             | Yes      | Defaults to `mongodb://mongo:27017/party-spies` for the Compose-internal Mongo. A full MongoDB Atlas SRV string also works. |
| `HTTP_PORT`             | No       | Host port mapped to the frontend nginx. Default `80`. |
| `BACKUP_DIR`            | No       | Mongo dump directory. Default `./backups`. |
| `BACKUP_RETENTION_DAYS` | No       | Delete dumps older than N days. Default `14`. |
| `MONGO_BACKUP_DATABASE` | No       | Database name to back up. Default: parsed from `MONGO_URI`. |

## Continuous deployment

The repo ships with two GitHub Actions workflows under `.github/workflows/`:

- **`ci.yml`** — on PR and on push to `main`: frontend lint + build, backend syntax check, `docker compose build`. On push to `main` (unless `DEPLOY_ENABLED=false`): SSH into your server and redeploy.
- **`deploy.yml`** — manual one-click **Deploy** from the Actions tab.

To use them on your own fork, add these under **Settings → Secrets and variables → Actions**:

| Type     | Name              | Description |
|----------|-------------------|-------------|
| Secret   | `DEPLOY_HOST`     | SSH hostname or IP of your server. |
| Secret   | `DEPLOY_USER`     | SSH user (e.g. `root` or a deploy user). |
| Secret   | `DEPLOY_SSH_KEY`  | Private SSH key (full PEM). The public half must be in `~/.ssh/authorized_keys` on the server. |
| Variable | `DEPLOY_PATH`     | Absolute path to the repo on the server, e.g. `/opt/spies`. |
| Variable | `DEPLOY_ENABLED`  | Set to `false` to skip auto-deploy on push (CI still runs). |

If you don't set these, CI still runs as normal and the deploy job is simply skipped.

## Project layout

```
spies/
├── docker-compose.yml
├── .env.example
├── .github/workflows/   ci.yml, deploy.yml
├── scripts/             deploy.sh, backup-mongo.sh, git-sync-for-deploy.sh, cron/
├── party-spies-back/    Node + Express + Socket.IO + Mongoose
└── party-spies-front/   React + Vite + Tailwind + i18n (en/de/ru)
```

## Contributing

Pull requests welcome. Some areas that could use love:

- More mission packs / additional languages — see `party-spies-back/local-db/tasks-*.js`
- Mobile-first UI polish
- Automated tests (currently none)
- Rate limiting and abuse protection on room creation

Open an issue first if you want to discuss a larger change, otherwise just send a PR.

## Security

If you find a security issue, please open an issue — or contact the maintainer privately if it's sensitive. General hygiene if you self-host: use a strong `JWT_SK`, keep `.env` out of version control, never expose MongoDB to the public internet, firewall SSH/HTTP/HTTPS.

## License

[GNU AGPL-3.0](LICENSE) © 2026 Pavel Smolin

If you run a modified version of this software on a network server — for example, hosting your own fork with your own URL — AGPL-3.0 requires you to make the corresponding modified source code available to the users of that service.
