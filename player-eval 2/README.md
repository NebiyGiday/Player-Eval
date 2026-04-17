# PlayerEval — Deployment Guide

Follow these steps in order. Each takes ~5 minutes. Total: ~25 minutes.

---

## Step 1 — GitHub

1. Go to https://github.com → create a free account
2. Click **New repository** → name it `player-eval` → Private → **Create**
3. In your terminal inside this project folder:

```bash
git init
git add .
git commit -m "Initial PlayerEval commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/player-eval.git
git push -u origin main
```

---

## Step 2 — Supabase (database)

1. Go to https://supabase.com → sign up free
2. **New project** → name `player-eval` → set a password → pick nearest region → Create
3. Wait ~2 min for provisioning
4. Go to **SQL Editor** (sidebar) → **New query**
5. Paste the entire contents of `supabase/schema.sql` → **Run**
6. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 3 — Clerk (auth)

1. Go to https://clerk.com → sign up free
2. **Create application** → name `PlayerEval`
3. Enable **Email** + **Google** sign-in → Create
4. On the API Keys page, copy:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`

---

## Step 4 — Vercel (hosting)

1. Go to https://vercel.com → sign up with GitHub
2. **Add New Project** → import your `player-eval` repo
3. Before deploying, open **Environment Variables** and add all of these:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | pk_test_... |
| `CLERK_SECRET_KEY` | sk_test_... |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | /auth/sign-in |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | /auth/sign-up |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | /dashboard |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | /dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJ... |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJ... |

4. Click **Deploy** → wait ~2 min
5. Your app is live at `https://player-eval-xxx.vercel.app`

---

## Step 5 — Add Vercel URL to Clerk

1. Clerk dashboard → **Domains** → add your Vercel URL
2. **Redirect URLs** → add:
   - `https://your-app.vercel.app/auth/sign-in`
   - `https://your-app.vercel.app/dashboard`

---

## Local Development

```bash
npm install
cp .env.local.example .env.local   # fill in your real keys
npm run dev
# open http://localhost:3000
```

---

## Project Structure

```
src/
  app/
    page.tsx          Landing page
    dashboard/        Coach dashboard (server component)
    players/          Player list + [id] profile
    evaluate/         3-step evaluation flow
    training/         Drill library
    auth/             Clerk sign-in / sign-up pages
  components/
    AppLayout.tsx     Bottom nav shell
  lib/
    supabase.ts       Supabase client
    utils.ts          Helpers + drill data
  types/index.ts      TypeScript types
  middleware.ts       Clerk route protection
supabase/
  schema.sql          Run this in Supabase SQL Editor
```
