# MedVault

*(repository codename: `XOR`)*

A personal health vault. Upload a lab report PDF, get a plain-language
explanation of what the numbers mean, ask follow-up questions about it, and keep
private notes alongside it.

MedVault is the Django rewrite of [Med-vault](https://github.com/adityamittal-dot/Med-vault),
a Next.js prototype that ran entirely on Supabase. The product is the same; the
backend is now a real API that owns its own auth, database and AI pipeline.

> **Not medical advice.** Every AI response is a plain-language explanation of a
> document, not a diagnosis. The prompts refuse to diagnose or prescribe.

## Stack

| Layer    | Choice                                             |
| -------- | -------------------------------------------------- |
| Backend  | Django 5.2, Django REST Framework, SimpleJWT       |
| Database | PostgreSQL (SQLite fallback for local development) |
| AI       | Google Gemini via `google-genai`                   |
| PDF      | `pdfplumber`                                        |
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS 4       |
| Infra    | Docker Compose, Gunicorn, WhiteNoise               |

## Quick start

### Local (no Docker)

```bash
python -m venv venv
source venv/Scripts/activate      # Windows; use venv/bin/activate on macOS/Linux
pip install -r requirements.txt

cp .env.example .env              # then edit it
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Leave `DB_NAME` empty in `.env` and the project uses SQLite, so it runs with no
database server installed. The API is then on <http://localhost:8000>.

```bash
cd frontend
cp .env.example .env
yarn install
yarn dev                          # http://localhost:5173
```

### Docker Compose

```bash
cp .env.example .env              # DB_HOST must be "db"
docker compose up --build
```

Compose starts Postgres, waits for it to pass a healthcheck, applies migrations
and then serves the API on `:8000` and the frontend on `:5173`.

## Configuration

All settings come from the environment; see `.env.example` for the full list.

| Variable               | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `DEBUG`                | `True` locally. Off enables HTTPS/HSTS/secure cookies.    |
| `SECRET_KEY`           | Required whenever `DEBUG` is off.                          |
| `DB_NAME`              | Set to use Postgres; leave empty for SQLite.               |
| `DB_HOST`              | `db` inside Compose, `localhost` otherwise.                |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins.                          |
| `GEMINI_API_KEY`       | Enables analysis and chat. Without it uploads store as `FAILED`. |
| `THROTTLE_LAB_AI`      | Rate limit on the AI endpoints, default `20/hour`.         |
| `MAX_UPLOAD_SIZE_BYTES`| Upload ceiling, default 10 MB.                             |
| `R2_BUCKET_NAME`       | Set to store uploads in an S3-compatible bucket (e.g. Cloudflare R2) instead of local disk — needed on hosts with an ephemeral filesystem. Leave empty for local disk. |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_ENDPOINT_URL` | Required alongside `R2_BUCKET_NAME`. |

## API

All endpoints except `register`, `login` and `refresh` require
`Authorization: Bearer <access token>`.

### Auth

| Method | Path                  | Purpose                                  |
| ------ | --------------------- | ----------------------------------------- |
| POST   | `/api/auth/register/` | Create an account, returns user + tokens |
| POST   | `/api/auth/login/`    | Returns user + tokens                    |
| POST   | `/api/auth/refresh/`  | Exchange a refresh token                 |
| POST   | `/api/auth/logout/`   | Blacklist the refresh token              |
| GET    | `/api/auth/me/`       | Current user                             |

Refresh tokens rotate on every use and are blacklisted on logout (SimpleJWT's
`token_blacklist` app), so a token that has been refreshed or logged out
cannot be replayed.

### Notes

`/api/notes/` — full CRUD, scoped to the signed-in user.

### Lab reports

| Method | Path                              | Purpose                              |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/lab-reports/`               | List your reports                    |
| POST   | `/api/lab-reports/`               | Upload a PDF (multipart `file`)      |
| GET    | `/api/lab-reports/{id}/`          | One report with its analysis         |
| DELETE | `/api/lab-reports/{id}/`          | Delete a report                      |
| POST   | `/api/lab-reports/{id}/reanalyze/`| Retry a failed analysis              |
| POST   | `/api/lab-reports/{id}/chat/`     | Ask a question about that report     |

A report moves through `UPLOADED → PROCESSING → READY`, or lands on `FAILED`
with the reason stored in `ai_analysis.error`. Analysis runs inline during the
upload request, so an upload takes as long as Gemini does.

### Assistant

| Method | Path                   | Purpose                                       |
| ------ | ---------------------- | --------------------------------------------- |
| POST   | `/api/assistant/chat/` | General health chat, grounded in your reports |

Unlike the per-report chat, this is not tied to one document. Summaries of your
five most recent `READY` reports are passed as background, so "is my hemoglobin
low?" is answered from your own data, while anything they do not cover falls
back to clearly-labelled general information.

## Tests

```bash
python manage.py test        # 40 backend tests
cd frontend && yarn lint && yarn typecheck && yarn build
```

The AI and PDF layers are mocked in tests, so no API key or network is needed.

## Project layout

```
accounts/   custom email-based user, JWT auth endpoints
notes/      per-user notes CRUD
lab/        PDF upload, text extraction, Gemini analysis and chat
home/       small unauthenticated endpoint
XOR/        Django project package - settings, root URLs, WSGI/ASGI
frontend/   React + Vite client
```

See [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for the architecture in depth and
the roadmap of known gaps.
