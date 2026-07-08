# JobSeeker AI

AI-powered job seeker platform that helps users upload a resume, discover matched roles, review job fit, and run detailed resume-vs-job analysis. The frontend is a Next.js application that proxies authenticated requests to a separate backend API.

## Features

- **Authentication** — Sign up and log in with email/password. Sessions are stored client-side and validated against the backend via `GET /me`.
- **Resume upload** — Upload a PDF resume (up to 5 MB). The backend converts it to markdown, returns a `resume_id`, and suggests matched jobs with fit scores.
- **Job matching** — Browse AI-matched jobs with salary, location, fit score, strengths, and possible gaps.
- **Job search** — Search for additional roles by title and location (authenticated).
- **Job detail pages** — View full job descriptions and apply via external job URLs.
- **AI resume analysis** — Run a per-job analysis that scores skills, experience, keywords, seniority, impact, and format; surfaces strengths, gaps, keyword suggestions, and recommended resume updates.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Forms | [react-hook-form](https://react-hook-form.com) |
| Validation | [Zod](https://zod.dev) |
| State | [Zustand](https://zustand.docs.pmnd.rs) (with persistence for auth) |
| Language | TypeScript |

## Architecture

```
Browser (React)
    │
    ├── Zustand stores (auth, resume/jobs)
    │
    └── Next.js API routes (/api/*)  ──►  Backend API (BACKEND_BASE_URL)
```

The app follows a **feature-based** layout under `features/`:

- **`features/auth`** — Login/signup UI, `useAuth` hook, session guard, auth store
- **`features/resume-upload`** — Resume upload, job search, job detail, resume analysis

Each feature typically contains:

- `models/` — TypeScript types
- `services/` — API client functions
- `store/` — Zustand state
- `hooks/` / `controllers/` — Business logic
- `views/` — Presentational components
- `index.tsx` or route-specific feature entry components

Next.js API routes in `app/api/` act as a **BFF (backend-for-frontend)** layer: they validate input, attach bearer tokens, and forward requests to the backend.

## User flow

1. **Sign up / log in** at `/signup` or `/login`
2. **Upload a PDF resume** on the home page (`/`)
3. Processing runs at `/processing` — resume is sent to the backend and matched jobs are stored
4. **Browse matched jobs** at `/jobs`
5. **Open a job** at `/jobs/[job_id]` — view details, apply, and run AI resume analysis

Unauthenticated users are redirected to `/login` (except on `/login` and `/signup`). Authenticated sessions are verified on load via `SessionGuard` calling `GET /me`.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io) (recommended) or npm/yarn
- A running **backend API** (default: `http://localhost:8000`)

### Installation

```bash
git clone <repository-url>
cd job-seeker-ai
pnpm install
```

### Environment variables

Copy the example env file and set your backend URL:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
| --- | --- | --- |
| `BACKEND_BASE_URL` | Base URL of the backend API | `http://localhost:8000` |

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## Frontend routes

| Route | Description | Auth required |
| --- | --- | --- |
| `/` | Resume upload landing page | Yes |
| `/login` | Log in | No |
| `/signup` | Create account | No |
| `/processing` | Resume upload processing | Yes |
| `/jobs` | Matched / searched jobs list | Yes |
| `/jobs/[job_id]` | Job detail + resume analysis | Yes |

## Next.js API routes

These routes are called by the frontend and proxy to the backend.

| Route | Method | Auth | Description |
| --- | --- | --- | --- |
| `/api/auth/login` | POST | No | Log in |
| `/api/auth/signup` | POST | No | Sign up |
| `/api/auth/me` | GET | Bearer | Verify session, fetch profile |
| `/api/resume` | POST | Bearer | Upload PDF resume |
| `/api/jobs/search` | POST | Bearer | Search jobs by title/location |
| `/api/resume-analysis/analyze` | POST | Bearer | Analyze resume against a job |

All protected routes expect:

```
Authorization: Bearer <access_token>
```

## Backend API (external)

The frontend expects these backend endpoints (via `BACKEND_BASE_URL`):

| Endpoint | Method | Description |
| --- | --- | --- |
| `/auth/login` | POST | `{ email, password }` → user + session |
| `/auth/signup` | POST | `{ name, email, password }` → user + session |
| `/me` | GET | Validate token; return user, profile, token metadata |
| `/pdf/upload-resume` | POST | Multipart PDF → `{ summary, jobs[], resume_id }` |
| `/jobs/search` | POST | `{ title, location, limit }` → `{ jobs[] }` |
| `/resume-analysis/analyze` | POST | `{ resume_id, job_description }` → analysis report |

## Authentication

- **Client storage:** User, session (access/refresh tokens), and profile are persisted in Zustand (`features/auth/store/auth.store.ts`).
- **`useAuth` hook:** Single source of truth for auth state, login/signup/logout, session verification, and redirect logic for protected routes.
- **`SessionGuard`:** On app load, verifies the access token with `GET /me` and clears invalid sessions.

Password signup includes client-side strength validation (length, uppercase, lowercase, number, special character) with debounced feedback.

## State management

| Store | Location | Purpose |
| --- | --- | --- |
| Auth | `features/auth/store/auth.store.ts` | User, session, profile, auth status |
| Resume upload | `features/resume-upload/store/resume-upload.store.ts` | Selected file, uploaded resume, jobs list, search state |

Job data and `resumeId` live in the resume upload store for the current session (not persisted across browser restarts by default).

## Resume analysis output

When a user analyzes their resume for a specific job, the UI displays:

- Overall score and category breakdown (skills, experience, keywords, seniority, impact, format)
- Summary and tailored resume summary
- Strengths with evidence
- Gaps with severity and recommendations
- Missing vs. present keywords
- Prioritized section updates with example rewrites
- Final recommendation

## Project structure

```
job-seeker-ai/
├── app/
│   ├── api/                    # Next.js API proxy routes
│   ├── jobs/                   # Job list & detail pages
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── processing/             # Resume processing page
│   ├── layout.tsx              # Root layout + SessionGuard
│   └── page.tsx                # Home (resume upload)
├── features/
│   ├── auth/                   # Authentication feature
│   └── resume-upload/          # Upload, jobs, analysis feature
├── .env.example
├── package.json
└── README.md
```

## Development notes

- Resume uploads accept **PDF only**, max **5 MB**.
- Job links use stable `job_id` values from the backend (URL-encoded in routes).
- Refresh token rotation is not implemented yet; expired sessions redirect to login.
- Ensure the backend is running and reachable at `BACKEND_BASE_URL` before testing upload, search, or analysis flows.
