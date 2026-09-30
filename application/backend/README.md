# DevOps Task Manager - Backend Service

Node.js + Express.js backend REST API with MongoDB database connectivity and health checks.

## Endpoints

- `GET /health` - Health check status and database connection state
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Fetch single task
- `POST /api/tasks` - Create task (`title`, `description`, `priority`, `status`)
- `PUT /api/tasks/:id` - Update task details or mark completed
- `DELETE /api/tasks/:id` - Remove task

## Environment Variables

- `PORT` (Default: `5000`)
- `MONGODB_URI` (Default: `mongodb://localhost:27017/devsecops-db`)
- `NODE_ENV` (Default: `production`)

## Running Locally

```bash
npm install
npm start
```
