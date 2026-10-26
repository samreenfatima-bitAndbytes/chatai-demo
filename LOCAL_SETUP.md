# ChatAI static demo — local setup

Fully static Vite + React build for Vercel. No FastAPI, no database, no OpenAI.

Original `chatai/` is untouched; this folder is a separate demo.

## Run locally

```bash
cd local-projects/chatai-static
npm install
npm run dev
```

Open http://localhost:2090

## Demo logins

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Business | `ana@acme.example`    | `DemoPass1!` |
| Admin    | `admin@chatai.example`| `DemoPass1!` |

## What works offline

- Login / logout (localStorage session)
- Dashboard stats
- Edit chatbot prompt, welcome, suggestions, widget color
- Upload / paste FAQ documents
- FAQ chat playground + embed widget (`/embed/bot-acme`)
- Admin overview
- Reset demo data

## Vercel

- Framework: Vite
- Root directory: this folder (`chatai-static`)
- Build: `npm run build`
- Output: `dist`
- SPA rewrite is in `vercel.json`

```bash
npm run build
npm run preview
```
