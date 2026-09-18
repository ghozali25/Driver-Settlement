# Driver Settlement Management System

Vercel-ready TypeScript + Vite frontend.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build check

```bash
npm run build
```

## Deploy to Vercel

1. Push folder to GitHub.
2. Open [vercel.com](https://vercel.com).
3. Select **Add New Project**.
4. Import GitHub repository.
5. Framework preset: **Vite**.
6. Build command: `npm run build`.
7. Output directory: `dist`.
8. Click **Deploy**.

## Backend architecture

Recommended Vercel backend:

- Vercel Functions in `api/*.ts`.
- Google Sheets API for database operations.
- Google Drive API for uploaded files.
- Google OAuth for authentication.
- Environment variables for Google service-account credentials.

Do not put service-account JSON or private keys in frontend code.
