# 4O4 FOUND — Run Guide

This version keeps the existing React/Tailwind UI and connects it to the FastAPI backend.

## 1. Backend

Open Terminal 1:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Check:

- http://127.0.0.1:8000/api/health → `{"status":"ok"}`
- http://127.0.0.1:8000/docs → FastAPI Swagger UI

Development mode uses the existing SQLite database (`404_found.db`) unless `DATABASE_URL` is configured.

## 2. Frontend

Open Terminal 2:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (normally http://localhost:5173; if that port is busy, Vite may use 5174).

## 3. Authentication flow

1. Open `/login`.
2. Switch to `Create account`.
3. Enter organization, display name, email and password.
4. Create account.
5. The frontend registers the account through FastAPI, logs the user in, stores JWT tokens and opens `/dashboard`.
6. Dashboard is protected and redirects unauthenticated users to `/login`.

## 4. Frontend → backend proxy

Vite proxies these paths to `http://localhost:8000`:

- `/api`
- `/auth`
- `/org`

This is important because authentication uses `/auth/*`, while item/search APIs use `/api/*`.

## 5. AI configuration

The current backend AI service uses Hugging Face inference APIs. Basic reporting/search can still be tested without an HF token; AI embeddings/captioning require `HF_API_TOKEN` in a local `.env` file.

Example:

```env
DEV_MODE=true
JWT_SECRET=change-this-for-real-deployment
HF_API_TOKEN=your_huggingface_token
```

Do not commit `.env` or API keys.
