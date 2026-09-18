# Driver Settlement Management System

Vercel‑ready **TypeScript + Vite** frontend with integrated backend using Vercel Functions.

## Features

- Google OAuth login (ID‑token verification).
- Google Sheets as lightweight database for users, drivers, settlements, settings, counters, etc.
- Google Drive for secure file storage.
- Session management with HTTP‑only secure cookies.
- Soft UI dashboard (responsive, Tailwind CSS).
- REST‑style API endpoints under `api/`.
- Environment‑driven configuration – all secrets stay server‑side.

## Local development

```bash
npm install           # install dependencies
npm run dev           # start Vite dev server (http://localhost:5173)
```

The app expects the following environment variables (create a `.env.local` file in the project root):

```env
# Google OAuth client ID (public)
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Secret for signing JWT session cookies
SESSION_SECRET=veryStrongRandomString

# Google service‑account JSON path (server‑only, not committed)
GOOGLE_SERVICE_ACCOUNT_KEY=./path/to/service-account.json

# Sheet IDs (replace with your own)
USERS_SHEET_ID=your-users-sheet-id
DRIVERS_SHEET_ID=your-drivers-sheet-id
SETTINGS_SHEET_ID=your-settings-sheet-id
COUNTERS_SHEET_ID=your-counters-sheet-id
```

## API overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/session` | POST | Verify Google ID token, create/read user, issue session cookie |
| `/api/drivers` | GET | Return driver list from **Drivers** sheet |
| `/api/counters` | POST | Atomically fetch and increment a named counter (e.g., settlement IDs) |
| `/api/settings` | GET / POST | Get or set configuration values stored in **Settings** sheet |

All endpoints enforce role‑based checks (admin vs driver) based on the `role` field stored in the Users sheet.

## Backend architecture

- **Vercel Functions** (`api/*.ts`) handle all server‑side logic.
- **Google Sheets** acts as the primary datastore – each sheet corresponds to a logical table (`Users`, `Drivers`, `Settlements`, `Counters`, `Settings`).
- **Google Drive** stores driver documents, invoices, and audit logs. Access is validated against the session user.
- **JWT session** stored in an HTTP‑only cookie (`session`) with a 7‑day expiry.

## Deployment to Vercel

1. Push the repository to GitHub (or any Git provider).
2. Log in to https://vercel.com and click **Add New Project**.
3. Import the GitHub repository.
4. Choose **Vite** as the framework preset.
5. Set the build command to `npm run build` and output directory to `dist`.
6. Add the environment variables listed above in the Vercel dashboard (keep the service‑account JSON file out of the repo and upload its contents as a secret).
7. Click **Deploy**.

## Folder structure

```
src/                # Frontend source (React + Tailwind)
api/                # Vercel Functions (backend)
  auth/            # auth/session.ts
  drivers/         # drivers/index.ts
  counters/        # counters/index.ts
  settings/        # settings/index.ts
google_sheets_client.ts   # Helper for Sheets CRUD
google_drive_client.ts    # Helper for Drive operations
.env.local          # Local env vars (ignored by Git)
```

---

**License**: MIT