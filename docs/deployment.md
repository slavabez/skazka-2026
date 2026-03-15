# Deployment and Containerization

## Docker Image

This repository includes a production-ready multi-stage `Dockerfile` for Next.js standalone mode.

- Base image: `node:22-alpine`
- Build stage: installs dependencies and runs `npm run build`
- Runtime stage:
  - copies `.next/standalone`, `.next/static`, and `public`
  - runs as non-root user `nextjs`
  - starts with `node server.js`

Build locally:

```bash
docker build -t ghcr.io/slavabez/skazka-2026:local .
```

Run locally:

```bash
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_URL=... \
  -e ODATA_API_URL=... \
  -e ODATA_API_AUTH_HEADER=... \
  -e REDIS_HOST=... \
  -e REDIS_PORT=6379 \
  -e REDIS_PASSWORD=... \
  ghcr.io/slavabez/skazka-2026:local
```

## Docker Compose (Production Placeholder)

`docker-compose.yml` is included as a production-oriented placeholder using image:

- `ghcr.io/slavabez/skazka-2026:latest`

Usage:

1. Create `.env` next to `docker-compose.yml`
2. Fill required env vars (`DB_URL`, `ODATA_API_URL`, etc.)
3. Run:

```bash
docker compose up -d
```

## GitHub Actions

### 1) CI workflow

File: `.github/workflows/ci.yml`

Runs on pull requests and pushes to `main`:

- `npm ci`
- `npm run lint`
- `npm test`
- `npm run build`

### 2) Docker publish workflow

File: `.github/workflows/docker-publish.yml`

Runs on PRs (build only), pushes to `main`, tags (`v*`), and manual dispatch.

- Builds multi-arch image (`linux/amd64`, `linux/arm64`)
- Publishes to `ghcr.io/slavabez/skazka-2026` on non-PR events
- Adds tags from branch/tag/sha and `latest` on default branch

## GitHub Secrets Setup

Open your repository on GitHub:

1. Go to `Settings` -> `Secrets and variables` -> `Actions`.
2. Click `New repository secret`.
3. Add secrets as needed:

- `GHCR_PAT` (optional but recommended for explicit package publish auth)
  - Fine-grained or classic PAT with package write permissions
  - If omitted, workflow falls back to `GITHUB_TOKEN`

If you add deployment workflows later, also add app runtime secrets there (for example `DB_URL`, `ODATA_API_URL`, `ODATA_API_AUTH_HEADER`, `REDIS_*`) and pass them only to deployment jobs.

## Required GitHub Package Settings

To publish successfully to GHCR:

- Ensure workflow permissions include `packages: write` (already set).
- In repo `Settings` -> `Actions` -> `General`, allow workflows to create and publish packages.
