# Note Taking App

A simple full‑stack note taking application with email/OTP and Google OAuth authentication.

Quick overview

- Frontend: React + Vite + TypeScript. Entry: [frontend/src/main.tsx](frontend/src/main.tsx). Routes and auth: [frontend/src/App.tsx](frontend/src/App.tsx).
- Backend: Express + TypeScript + MongoDB. Server entry: [backend/src/index.ts](backend/src/index.ts).
- API client used by the frontend: [`api`](frontend/src/utils/api.ts) — [frontend/src/utils/api.ts](frontend/src/utils/api.ts).
- Client auth state: [`useAuthStore`](frontend/src/store/useAuthStore.ts) — [frontend/src/store/useAuthStore.ts](frontend/src/store/useAuthStore.ts).

Prerequisites

- Node.js (v18+ recommended)
- npm
- A MongoDB connection string
- Google OAuth credentials (Client ID & Client Secret) if using Google sign-in

Environment

- Backend env: [backend/.env](backend/.env)
  - DB_URL, PORT, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, JWT_SECRET, MAILER_EMAIL, MAILER_PASSWORD, MAILER_SERVICE, FROM
- Frontend env: [frontend/.env](frontend/.env)
  - VITE_OAUTH_ID

Important backend symbols

- Authentication helpers: [`verifyJWT`](backend/src/lib/auth.ts) and [`TokenPayload`](backend/src/lib/auth.ts) — [backend/src/lib/auth.ts](backend/src/lib/auth.ts)
- Cookie setter: [`setAuthCookie`](backend/src/lib/cookies.ts) — [backend/src/lib/cookies.ts](backend/src/lib/cookies.ts)
- Auth middleware: [`authenticateToken`](backend/src/middleware/auth.ts) — [backend/src/middleware/auth.ts](backend/src/middleware/auth.ts)
- Auth controller: [backend/src/controllers/authController.ts](backend/src/controllers/authController.ts)

Frontend pages

- Sign In: [frontend/src/pages/SignIn.tsx](frontend/src/pages/SignIn.tsx)
- Sign Up: [frontend/src/pages/Signup.tsx](frontend/src/pages/Signup.tsx)
- Dashboard: [frontend/src/pages/DashBoard.tsx](frontend/src/pages/DashBoard.tsx)

Setup and run

1. Install dependencies

- Backend
  ```sh
  cd backend
  npm install
  ```
- Frontend
  ```sh
  cd frontend
  npm install
  ```

2. Configure environment

- Copy and edit env files:
  - Backend: edit [backend/.env](backend/.env)
  - Frontend: edit [frontend/.env](frontend/.env)

3. Start development servers

- Backend (watch mode)

  ```sh
  cd backend
  npm run dev
  ```

  Server runs on PORT from [backend/.env](backend/.env). CORS origin is configured in [backend/src/index.ts](backend/src/index.ts).

- Frontend
  ```sh
  cd frontend
  npm run dev
  ```
  Vite dev server uses the Google OAuth ID from [frontend/.env](frontend/.env) and [frontend/src/main.tsx](frontend/src/main.tsx).

Notes

- API base URL used by the frontend is set in [frontend/src/utils/api.ts](frontend/src/utils/api.ts). Ensure backend runs at that address or update the value.
- Protected routes use the token cookie set by the backend. See [`setAuthCookie`](backend/src/lib/cookies.ts) and [`authenticateToken`](backend/src/middleware/auth.ts).
- OTP emails are sent via nodemailer configured in [backend/src/config/nodemailer.config.ts](backend/src/config/nodemailer.config.ts); ensure mailer credentials in [backend/.env](backend/.env) are valid.

Build & production

- Frontend build:
  ```sh
  cd frontend
  npm run build
  ```
- Backend build / start:
  ```sh
  cd backend
  npm run build
  npm run start
  ```

Troubleshooting

- CORS errors: check origin in [backend/src/index.ts](backend/src/index.ts).
- Auth cookie not present: inspect network cookies; backend sets cookie via [`setAuthCookie`](backend/src/lib/cookies.ts).
- Mongo connection issues: verify DB_URL in [backend/.env](backend/.env).

Package scripts

- Frontend scripts: see [frontend/package.json](frontend/package.json)
- Backend scripts: see [backend/package.json](backend/package.json)

Contributing

- Follow the existing code style used across frontend and backend.
- For UI components, refer to the UI components under [frontend/src/components/ui](frontend/src/components/ui).

License

- MIT
