# Docker Orchestration Setup

This directory contains containerization configs for local development, testing, and production container builds.

## Components

1. **MongoDB**: Official `mongo:6.0` image with volume persistence (`mongodb_data`).
2. **Backend**: Multi-stage Node.js container with non-root security (`node:node` user).
3. **Frontend**: Multi-stage build (Node 18 -> Nginx 1.25 Alpine) with reverse proxy routing.

## Usage

```bash
# Start all containers in background
docker compose up -d

# View logs
docker compose logs -f

# Check container statuses and health
docker compose ps

# Stop containers
docker compose down
```
