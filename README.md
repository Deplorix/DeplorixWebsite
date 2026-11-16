# DeploriX Technologies Website

Production website and internal certificate tooling for DeploriX Technologies. The project uses React, TypeScript, Vite, Tailwind CSS, Express/Vercel functions, MongoDB, Supabase and Resend.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and configure the required values. Never commit `.env`.
3. Run `npm run dev`. The Vite development server includes the local `/api` middleware.

## Required environment variables

- `MONGODB_URI` and `MONGODB_DB_NAME`: inquiry and internship application logging.
- `RESEND_API_KEY`: direct internship email delivery.
- `INTERNSHIP_TO_EMAIL`: careers inbox; defaults to `deplorixtechnologies@gmail.com`.
- `INTERNSHIP_FROM_EMAIL`: verified Resend sender.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`: certificate verification, admin authentication and Project Advisor.
- Supabase function secret `AI_API_KEY` or `OPENAI_API_KEY`: Project Advisor generation.

## Architecture

- `src/pages`: route-level screens.
- `src/components`: reusable UI and feature components.
- `src/lib`: browser-side API clients and domain helpers.
- `api`: Vercel serverless handlers.
- `server`: shared validation, email delivery, database adapters and standalone Express/Vite APIs.
- `supabase/functions`: Supabase Edge Functions.
- `supabase/migrations`: database schema and row-level security policies.

Validation shared by multiple server entry points belongs in `server/` so the Express, Vite and Vercel paths behave consistently. Never rely only on browser validation for public submissions.

## Quality checks

Run before deployment:

```powershell
npm run lint
npx tsc --noEmit --pretty false
npm test -- --run
npm run build
```

## Deployment notes

- Configure secrets in the deployment environment; do not prefix server secrets with `VITE_`.
- Internship email intentionally returns an error if Resend is not configured or delivery is not confirmed.
- `/verify/:certificateId` is the public certificate-verification route used by generated QR codes.
- Add production-grade rate limiting or a bot challenge before promoting public AI or submission endpoints at high traffic.
- If a secret was ever committed, removing the file from the current tree is not sufficient—rotate the credential.
