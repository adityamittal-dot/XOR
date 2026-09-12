# MedVault — Project Overview

*(repository codename: `XOR`)*

Everything about what this project is, how it got here, how it is put together,
and what is worth building next. Read `README.md` first if you just want to run it.

---

## 1. What the product is

MedVault is a **personal health vault**. A patient gets a lab report PDF from a
pathology lab and it is nearly unreadable: dozens of acronyms, numbers and
reference ranges, no explanation. MedVault turns that into something a person can
actually act on.

The core loop:

1. **Sign in** with email and password.
2. **Upload a lab report PDF.**
3. The backend **extracts the text** and asks Gemini for a structured,
   deliberately cautious analysis: a summary, key findings, which values fall
   outside their reference range, questions to bring to a doctor, and red flags
   that warrant urgent attention.
4. **Ask follow-up questions** in a chat grounded in that specific report.
5. **Ask general health questions** in an assistant that has your analysed
   reports as background.
6. **Keep private notes** — symptoms, questions, reminders — beside the reports.

The guardrails are a product feature, not an afterthought. Every prompt forbids
diagnosis, prescription and speculation beyond the document, and requires the
model to say "Not found in report" rather than invent a value. The goal is
comprehension, not a second opinion.

---

## 2. How the two repositories relate

### Med-vault — the prototype

[Med-vault](https://github.com/adityamittal-dot/Med-vault) is the original
Next.js 16 app. It proved the idea quickly by leaning on managed services:

- **Supabase** for Google OAuth sign-in, the Postgres database, and row-level
  security that scoped every row to its owner.
- **Next.js API routes** (`app/api/lab/upload`, `app/api/lab/reports`) as the
  only backend, calling Gemini directly from the route handler.
- **Gemini** for analysis, given the PDF as base64 because `pdf-parse` did not
  survive Next.js + Turbopack — so raw text was never extracted and `raw_text`
  was stored as an empty string.

It works, but the architecture is a dead end for this product. Business logic
lives in route handlers, auth and data are rented from Supabase, and the AI
pipeline cannot be tested, retried, or moved off the request path.

### MedVault — the real build

MedVault is the same product rebuilt on **Django + DRF**, owning the parts that
matter:

| Concern     | Med-vault                | MedVault                                      |
| ----------- | ------------------------ | --------------------------------------------- |
| Auth        | Supabase Google OAuth    | Custom email user model + JWT (SimpleJWT)     |
| Database    | Supabase Postgres + RLS  | Own Postgres, ownership enforced in querysets |
| Row scoping | SQL policies             | `get_queryset()` filtered by `request.user`   |
| API         | Next.js route handlers   | DRF ViewSets and serializers                  |
| PDF text    | Never extracted (empty)  | `pdfplumber` extracts real text               |
| AI          | Called inside a route    | Isolated, mockable `lab/gemini_client.py`     |
| Frontend    | Next.js App Router       | React + Vite SPA calling the API              |
| Deployment  | Vercel                   | Docker Compose, Gunicorn, Postgres            |

The frontend components were carried over from Med-vault and rewired from
Supabase calls to MedVault's API.

**Why this migration is worth it:** the data is medical, so ownership checks,
retention and audit belong in code you control, not in vendor policies. The
analysis pipeline is the heart of the product and needs to be testable,
retryable and eventually asynchronous — which means it has to be a real backend.

---

## 3. Architecture

```
React + Vite SPA  ──HTTP + JWT──►  Django REST Framework
  localhost:5173                     localhost:8000
                                          │
                            ┌─────────────┼─────────────┐
                            ▼             ▼             ▼
                       PostgreSQL   media/ (PDFs)   Gemini API
```

### Backend apps

- **`accounts/`** — a custom `User` keyed on email with no username field, its
  own `UserManager`, and register / login / me / refresh endpoints.
  Registration runs Django's password validators and returns tokens immediately.
- **`notes/`** — a `ModelViewSet` scoped to the current user. Ownership is
  enforced in `get_queryset()`, so another user's note returns 404, not 403.
- **`lab/`** — the heart of the app.
  - `models.py` — `LabReport` with a `Status` state machine
    (`UPLOADED → PROCESSING → READY | FAILED`).
  - `utils.py` — PDF text extraction, plus a magic-byte check so a renamed
    `.txt` cannot pose as a PDF.
  - `gemini_client.py` — all Gemini access. The client is built lazily so the
    project imports, migrates and tests without an API key.
  - `views.py` — upload, list, delete, `reanalyze`, per-report `chat`, and the
    general `AssistantChatView` at `/api/assistant/chat/`.
- **`home/`** — a small unauthenticated endpoint.

### Request flow for an upload

1. `POST /api/lab-reports/` with a multipart `file`.
2. The serializer checks size and magic bytes, rejecting non-PDFs with 400.
3. The row is saved as `PROCESSING`.
4. `pdfplumber` extracts text. No selectable text (a scanned PDF) → `FAILED`
   with an explanatory error.
5. Gemini returns JSON, which is validated and stored → `READY`.
6. Any AI failure → `FAILED` with the reason stored, never a 500.

The report is always persisted, so a failure is inspectable and retryable via
`reanalyze` rather than lost.

---

## 4. State of the migration

**Working end to end:** registration, login and logout, JWT issue/refresh/
rotation with blacklisting, notes CRUD, PDF upload with validation, text
extraction, Gemini analysis, per-report chat, the general assistant chat,
retry, deletion, ownership isolation, the admin site, Docker Compose, and a
40-test backend suite. The frontend typechecks, lints and builds clean.

**Deliberately not built yet:** the Gmail import from Med-vault is not ported —
`gmail.connector.tsx` is still a demo dialog. Google OAuth sign-in is not
reimplemented; MedVault uses email and password.

**Branches:** `backend-XOR`, `Frontend` and `Dockerize-XOR` are fully merged
into `main`. `medvault` and `medvault-1` are superseded — their only unique
content was the chatbot page (now rebuilt against a real endpoint), a
dummy-data dashboard, and files that would reintroduce `db.sqlite3`, tracked
`.pyc` files and the Tailwind v3 config. They can be deleted.

---

## 5. Scope for improvement

Ordered by how much they matter.

### 5.1 Move AI work off the request path — highest priority

Analysis runs **inline inside the upload request**. A large PDF plus a slow
Gemini call can take 30–60 seconds, during which the browser waits, a Gunicorn
worker is tied up, and any proxy timeout kills the request mid-analysis.

**Fix:** add Celery (or Django-Q / RQ) with Redis. The upload returns `202`
immediately with a `PROCESSING` row, a worker does the extraction and analysis,
and the client polls or subscribes for completion. The `Status` field and the
`reanalyze` endpoint were designed for exactly this — the state machine already
models async work, so this is mostly moving `_process()` into a task.

This also unlocks automatic retries with backoff on transient Gemini errors,
which currently just mark a report failed.

### 5.2 Security and privacy hardening

The data is medical, so this deserves real attention:

- **Uploaded PDFs are served from `MEDIA_URL` with no access control.** Anyone
  holding the URL can read anyone's report. Serve them through an authenticated
  view that checks ownership, or use signed, short-lived URLs.
- **Encrypt reports at rest.** Med-vault's schema even had an `encrypted` flag
  on notes that was never implemented.
- **Add a retention and deletion policy** — a real "delete my data" path that
  removes the stored file, not just the row.
- **Audit logging** for every read and write of a report.
- **Scan or sandbox uploads.** Magic bytes stop a mislabelled file, not a
  malicious PDF.
- **Token storage.** JWTs live in `localStorage`, which is XSS-readable. Refresh
  tokens in an HttpOnly cookie would be materially safer.
- ~~**Blacklist refresh tokens on logout.**~~ Done — `POST /api/auth/logout/`
  blacklists the refresh token via SimpleJWT's `token_blacklist` app, and
  rotation blacklists the previous token automatically
  (`BLACKLIST_AFTER_ROTATION`).

### 5.3 Make the AI layer trustworthy

- **Use structured output properly.** Gemini supports a response schema; pass
  the analysis shape as a real schema instead of describing it in the prompt and
  parsing JSON back out of prose.
- **Store the prompt and model version** on each report, so an analysis can be
  reproduced and old results explained after a prompt change.
- **Evaluate the prompts.** Build a small fixture set of reports with known
  abnormal values and assert the model flags them. Right now prompt quality is
  entirely unverified.
- **Handle scanned PDFs with OCR** (Tesseract). Image-only reports are common
  from Indian labs and currently fail outright.
- **Parse values into rows.** `abnormal_values` is free text; a real `LabValue`
  model (test, value, unit, range, status) would enable trends over time —
  "your hemoglobin across the last four reports" is the feature that makes this
  a vault rather than a viewer.

### 5.4 API and backend polish

- **Pagination** is not configured. A user with hundreds of reports gets them
  all in one response. Add `PageNumberPagination` — and update the frontend,
  which currently assumes a bare array.
- **API documentation** via `drf-spectacular` for an OpenAPI schema and Swagger UI.
- **Persist chat history.** Conversations live in React state and vanish on
  refresh; the backend is stateless and re-sends history on every turn.
- **Soft deletes** so a mistaken deletion is recoverable.
- **Health check endpoint** for container orchestration.
- **`tags` on notes** is a `JSONField` the API never exposes and the UI never uses.

### 5.5 Frontend

- **Adopt a data-fetching library** (TanStack Query). Every page hand-rolls
  loading, error and refetch state in `useEffect`.
- **Poll or subscribe while a report is `PROCESSING`.** Once analysis is async,
  the UI must reflect progress instead of showing a stale status.
- **Replace `alert()` and `confirm()`** with real dialogs and toasts.
- **Accessibility pass** — focus management in dialogs, keyboard navigation,
  ARIA labels on icon-only buttons.
- **Add frontend tests.** There are none; Vitest plus Testing Library covering
  the auth and upload flows would protect the risky paths.
- **Code-split routes.** The bundle is ~400 KB in a single chunk.
- **Finish the shared UI.** `lab-gemini-panel.tsx` and `gmail.connector.tsx` are
  still demo components with hardcoded responses, and `conditional-layout.tsx`
  is unused.

### 5.6 Engineering practice

- **CI.** No pipeline exists. GitHub Actions running `manage.py test`,
  `yarn lint`, `yarn typecheck` and `yarn build` on every push would have caught
  most of what was broken here.
- **Branch hygiene.** The repo carries `main`, `backend-XOR`, `frontend`,
  `Dockerize-XOR`, `medvault` and `medvault-1`. Merge what is live and delete
  the rest.
- **Linting and formatting** — `ruff` and `black` for Python, Prettier for the
  frontend, ideally through pre-commit hooks.
- **Dependency management.** `requirements.txt` is now pinned; splitting out a
  `requirements-dev.txt` (or moving to `pyproject.toml` + `uv`) would separate
  test tooling from runtime.
- **Production Docker image.** The image is functional but single-stage; a
  multi-stage build serving a compiled frontend through WhiteNoise or nginx
  would shrink it and keep the dev server out of the deployment path.
- **Type checking Python** with `mypy` or `pyright`.

---

## 6. Notes for whoever works on this next

- **`DB_NAME` empty means SQLite.** You do not need Postgres running to work on
  a feature. Docker Compose sets it, so containers still use Postgres.
- **No `GEMINI_API_KEY` is fine.** The app runs and the tests pass; uploads
  simply land in `FAILED` with a clear reason. Every test mocks the AI layer, so
  the suite needs no network.
- **Ownership is enforced in `get_queryset()`.** Any new model holding user data
  must do the same — there is no row-level security net underneath any more.
- **Migrations are checked in.** Run `makemigrations` after touching a model and
  commit the result.
