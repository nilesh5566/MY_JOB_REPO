# TalentLaunch Web App — Next.js v5

AI-powered career OS for CS freshers. Full web app built with Next.js 14, MongoDB, and Groq AI.

## Features
- 🔍 Live job search (Remotive, Arbeitnow APIs)
- 🤖 12 AI tools powered by Groq (free)
- 📄 Resume builder with AI enhancement
- 📊 Application tracker + analytics
- 🏆 XP gamification + badges
- 🌐 Referral finder + success stories
- ☁️ MongoDB cloud sync

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in:
- `MONGODB_URI` — from MongoDB Atlas (free tier)
- `NEXTAUTH_SECRET` — any random string (e.g. run `openssl rand -base64 32`)
- `NEXTAUTH_URL` — `http://localhost:3000` for dev
- `GROQ_API_KEY` — optional server-side key from console.groq.com

### 3. Run dev server
```bash
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel
```

Or connect GitHub repo to vercel.com for auto-deploy.

Add environment variables in Vercel dashboard → Settings → Environment Variables.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (custom)
- **AI**: Groq API (llama-3.1-8b-instant)
- **Styling**: Tailwind CSS
- **Fonts**: Syne + Manrope

## Project Structure
```
app/
  page.tsx              — Landing page
  (auth)/
    login/page.tsx      — Login
    register/page.tsx   — Register
  (dashboard)/
    layout.tsx          — Sidebar layout
    dashboard/page.tsx  — Home dashboard
    jobs/page.tsx       — Job search
    ai/page.tsx         — 12 AI tools
    resume/page.tsx     — Resume builder
    tracker/page.tsx    — Application tracker
    network/page.tsx    — XP & network
  api/
    auth/login/         — POST login
    auth/register/      — POST register
    ai/                 — POST AI proxy
    jobs/               — GET live jobs
lib/
  db.ts                 — MongoDB connection
  models/User.ts        — User schema
```
