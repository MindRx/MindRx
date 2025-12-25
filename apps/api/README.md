# @mindrx/api

Hosted API backend for MindRx.

## Status

The production API runs on separate infrastructure at `api.mindrx.tech`.

This package contains the API server code for self-hosting.

## Endpoints

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/v1/chat` | POST | Streaming chat completion |
| `/v1/states` | GET | List available states |
| `/health` | GET | Health check |

## Self-Hosting

```bash
cd apps/api
npm install
npm start
```

## Environment Variables

| Variable | Description | Default |
|:---------|:------------|:--------|
| `PORT` | Server port | 3001 |
| `OLLAMA_HOST` | Ollama backend URL | http://localhost:11434 |
