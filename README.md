# 🚀 TalentLaunch — CS Career OS

> **The all-in-one career platform for Computer Science freshers and interns** — find jobs globally, build your resume, prep for interviews, and track applications with AI-powered tools.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![Groq](https://img.shields.io/badge/AI-Groq%20%2B%20Gemini%20%2B%20Cohere-orange)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 📋 Table of Contents

1. [What is TalentLaunch?](#-what-is-talentlaunch)
2. [Why We Built This](#-why-we-built-this)
3. [Tech Stack](#-tech-stack)
4. [Complete Feature List](#-complete-feature-list)
5. [Project Structure](#-project-structure)
6. [Prerequisites](#-prerequisites)
7. [Step-by-Step Installation](#-step-by-step-installation)
8. [Environment Variables](#-environment-variables)
9. [Free API Keys Setup](#-free-api-keys-setup)
10. [Running the App](#-running-the-app)
11. [All Pages & How to Use Them](#-all-pages--how-to-use-them)
12. [AI Tools Guide](#-ai-tools-guide-26-tools)
13. [Job Sources](#-job-sources-20-sources)
14. [Role-Based Access](#-role-based-access)
15. [Deploying to Production](#-deploying-to-production)
16. [Troubleshooting](#-troubleshooting)
17. [Version History](#-version-history)

---

## 🎯 What is TalentLaunch?

TalentLaunch is a **full-stack Next.js web application** that serves as a complete career operating system for CS students. It aggregates job listings from **20 free global sources**, provides **26 AI-powered career tools**, tracks applications with a Kanban board, helps build resumes, and gamifies the job search with XP and badges.

**Who is it for?**
- Computer Science students looking for their first job or internship
- Freshers (0–2 years experience) in AI/ML, Data Science, Full Stack, MERN, Software Development
- Students applying to startups, small, mid, and large companies worldwide

---

## 💡 Why We Built This

Job hunting as a fresher is overwhelming:
- Jobs are scattered across dozens of platforms
- Resumes get rejected by ATS systems without explanation
- Interview prep resources are fragmented and expensive
- There's no single tool that goes from "find job" → "apply" → "track" → "get offer"

TalentLaunch solves all of this in one place, for free.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, fast, React-based |
| **Styling** | Tailwind CSS | Utility-first, responsive, dark mode ready |
| **Backend** | Next.js API Routes | No separate server needed, serverless-ready |
| **Database** | MongoDB Atlas | Free tier, flexible schema, cloud-native |
| **Auth** | JWT (jsonwebtoken) + bcryptjs | Lightweight, secure, no third-party dependency |
| **AI (Primary)** | Groq API (Llama 3.3 70B) | Free tier: 14,400 requests/day, ultra-fast |
| **AI (Fallback)** | Gemini, Cohere, Mistral, OpenAI | Auto-fallback if primary fails |
| **PDF Parsing** | pdf-parse | Reads uploaded resumes locally |
| **Hosting** | Vercel / Railway / Render | One-click deployment, free tiers available |

---

## ✨ Complete Feature List

### 🌍 Global Job Search
- **20 job sources** aggregated in real time (1500+ jobs per fetch)
- Filter by: skills, job type (full-time/intern/remote), company size, source
- Smart deduplication removes duplicate listings across sources
- Save jobs with one click (+10 XP per save)
- Notes per job card (private, stored locally)
- Deadline tracker with urgency colour coding (overdue / 3 days / 7 days)
- 80+ curated company career page direct links
- Company Career Pages tab (Google, Razorpay, Swiggy, Atlassian, etc.)
- Skills demand heatbar on every search

### 🤖 AI Suite — 26 Tools
All AI calls go through the server (`/api/ai`). Your API key is never exposed in the browser.

**Resume Tools**
- Resume Score /100 (Formatting · Keywords · Impact · ATS · Completeness)
- AI Resume Rewriter (full rewrite, ATS-optimised)
- ATS Score Checker (will your resume pass?)
- Resume Version Manager (save multiple versions by role)
- PDF Resume Upload (upload from device, AI reads it)

**Job Match Tools**
- Job Match % (compare resume to any job)
- Skill Gap Analyzer (what's missing + how long to learn)
- JD Analyzer (red flags, green flags, culture hints, difficulty)

**Interview Tools**
- Mock Interview (AI plays interviewer, full chat)
- Voice Mock Interview (speak your answer, AI grades it)
- Interview Prep (technical + behavioural + role-specific Q&A)
- Interview Answer Grader (paste answer → STAR score + model answer)
- Interview Follow-up Email

**Writing Tools**
- Cover Letter Generator (4 tone options)
- Cold Email to Hiring Manager
- LinkedIn Post Generator (4 tone options)
- LinkedIn Full Profile Optimizer (headline + about + experience bullets)
- Referral Email Generator

**Strategy Tools**
- Career Roadmap (5-year path with titles + salaries)
- Career Path Predictor (Year 1 → Year 5 with companies + packages)
- Dream Company Strategy (custom 3-month prep plan per company)
- Salary Negotiation Simulator (live multi-turn roleplay with AI HR)
- Visa & Relocation Guide (best countries by skills + difficulty + timeline)
- Offer Comparison Tool (compare 2–3 offers, AI recommends)
- Portfolio / Project Idea Generator

**Fun / Viral**
- Resume Roast (brutal honest AI feedback, shareable card)
- GitHub Profile Reviewer

### 📄 Resume Builder
- 5-step guided form: Personal → Skills → Experience → Education → Projects
- 3 templates: Modern / Classic / Minimal
- AI-enhance individual bullet points with Groq
- Live HTML preview in an iframe
- Download as HTML (printable as PDF from browser)
- PDF upload to auto-read existing resume
- Save multiple named versions per role

### 📊 Application Tracker
- **Kanban board** (drag-and-drop): Bookmarked → Applied → OA → Interview → Offer → Rejected
- **List table** view with inline status dropdown
- **Analytics view**: application funnel chart, top hiring cities, weekly progress
- Add/edit/delete applications with notes, salary, URL, contact fields
- CSV export of all applications
- +20 XP per new application logged

### 🌱 Fresher Hub (dedicated page)
- Fresher Job Board — auto-filtered to 0–2 yr experience
- Off-Campus Drive Board — TCS NQT, Infosys InfyTQ, Wipro NLTH, Google STEP, Microsoft MSIDC, Amazon, Flipkart, Zomato with direct links + deadlines + tips
- Campus Placement Tracker — FAANG / Product / Service tier companies with visit dates, packages, CGPA cutoffs
- Internship → FTE Conversion Tracker — log stipend, mentor, PPO status

### 📈 Analytics Page
- Weekly Progress Report (applied / interviews / offers vs last week)
- Top Hiring Cities bar chart
- Best Companies for Freshers ranked list (salary × culture × WLB × fresher-hire rate)
- Salary Predictor (enter skills + years → India / US / EU / Remote ranges)

### 🏆 Gamification & XP System
- XP earned for: saving jobs (+10), logging applications (+20), downloading resume (+30), completing AI tools (+5 each)
- 10 unlockable badges (First Save, First Application, Interview Unlocked, Offer Received, etc.)
- Level system: Fresher → Junior Dev → Mid Engineer → Senior → Tech Lead
- 15-week activity heatmap (GitHub-style contribution grid)
- Weekly application goal tracker with progress bar

### 👥 Network & Community
- **XP Leaderboard** — compete with other TalentLaunch users (opt-in, anonymous)
- **Achievement Share Card** — beautiful 1200×630 PNG downloadable, LinkedIn-ready
- **Peer Resume Review Board** — submit resume, get community feedback anonymously
- **Interview Experience Board** — share your exact interview rounds + tips (Glassdoor-style)
- **Referral Marketplace** — post/find referral offers by company + skills
- **Confessions Board** — 100% anonymous: rejections, offers, vents, tips
- **Study Groups** — create or join accountability groups with Discord/WhatsApp/Meet links
- **Success Stories Wall** — submit your hiring story, inspire others

### 👤 Public Profile & Growth
- Public profile page: `talentlaunch.app/u/yourname`
- Shows XP, level, badges, skills, stats, GitHub/LinkedIn links
- One-click share card generation (PNG, perfect for LinkedIn)
- **Campus Ambassador Program** — unique referral code, milestone rewards (5/15/30 referrals → XP + special badges)

### 🎓 TPO / College Portal
- Training & Placement Officer dashboard
- Live placement drive calendar
- Student stats overview
- Embed code for college website

### 💡 Resource Library
- 56 curated resources across: DSA, System Design, Projects, Interview Prep, OS/DBMS/CN, Resume & Career
- Free/paid labels, bookmarkable, searchable
- Sources: Striver, NeetCode, Grokking, CS50, and more

### 💰 Salary Reports
- Anonymous crowdsourced salary data (company + role + city + year + package)
- Upvote system, filter by FTE / Intern / Contract

### 📤 Job Board Embed
- Generate `<iframe>` embed code for college TPO websites
- Configurable: theme, job limit, fresher-only toggle

### 🌐 Multi-language UI
- Switch between English / हिन्दी / தமிழ் / తెలుగు
- Cycle from the sidebar

### 📱 PWA Support
- `manifest.json` with 4 shortcuts
- Installable on Android/iOS (Add to Home Screen)

---

## 📁 Project Structure

```
talentlaunch-web/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login (Student / Recruiter / Admin)
│   │   └── register/page.tsx       # Register with role selection
│   └── (dashboard)/
│       ├── layout.tsx              # Sidebar + mobile nav + theme switcher
│       ├── dashboard/page.tsx      # XP, stats, heatmap, goals, daily tip
│       ├── jobs/page.tsx           # Live Jobs + Career Pages + API Sources + Deadlines
│       ├── fresher/page.tsx        # Fresher Hub (drives, campus, internship tracker)
│       ├── ai/page.tsx             # All 26 AI tools
│       ├── resume/page.tsx         # 5-step resume builder + version manager
│       ├── tracker/page.tsx        # Kanban + list + analytics
│       ├── analytics/page.tsx      # Market insights + salary predictor
│       ├── network/page.tsx        # Badges, gamification, referral finder
│       ├── community/page.tsx      # Leaderboard, confessions, study groups, stories
│       ├── profile/page.tsx        # Public profile + ambassador program
│       ├── resources/page.tsx      # Resource library
│       ├── salary/page.tsx         # Anonymous salary reports
│       ├── embed/page.tsx          # Job board embed generator
│       ├── tpo/page.tsx            # College TPO portal
│       ├── roast/page.tsx          # Resume Roast (AI brutal feedback)
│       ├── voice-interview/page.tsx # Voice Mock Interview
│       └── admin/page.tsx          # Admin job posting + management
├── lib/
│   ├── db.ts                       # MongoDB connection (cached)
│   └── models/User.ts              # User schema (mongoose)
├── app/api/
│   ├── auth/
│   │   ├── login/route.ts          # POST /api/auth/login
│   │   └── register/route.ts       # POST /api/auth/register
│   ├── ai/route.ts                 # POST /api/ai (multi-provider AI proxy)
│   ├── jobs/route.ts               # GET /api/jobs (20-source aggregator)
│   ├── parse-resume/route.ts       # POST /api/parse-resume (PDF → text)
│   └── digest/route.ts             # GET /api/digest (weekly email HTML)
├── public/
│   ├── manifest.json               # PWA manifest
│   └── icons/                      # PWA icons
├── .env.local                      # Your secrets (never commit this)
├── .env.example                    # Template for env variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🔧 Prerequisites

Before you start, make sure you have:

| Tool | Version | How to check |
|------|---------|--------------|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | Any | `git --version` |

If Node.js is not installed, download it from [nodejs.org](https://nodejs.org) (LTS version).

---

## 📦 Step-by-Step Installation

### Step 1 — Get the Code

**Option A — From ZIP (no Git needed):**
1. Download `TalentLaunch-NextJS-WebApp.zip`
2. Right-click → Extract All
3. Open the extracted folder `talentlaunch-web` in your terminal

**Option B — Clone from GitHub:**
```bash
git clone https://github.com/your-username/talentlaunch-web.git
cd talentlaunch-web
```

### Step 2 — Install Dependencies

```bash
npm install
```

This installs all packages including `pdf-parse`, `mongoose`, `bcryptjs`, `jsonwebtoken`, and all Next.js dependencies. Takes 1–2 minutes.

### Step 3 — Set Up MongoDB (Free)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Sign up free
2. Click **Build a Cluster** → choose **M0 Free** → any region → Create
3. **Database Access** (left sidebar) → **Add New Database User**
   - Username: `tluser`
   - Auto-generate password → **copy the password**
   - Role: Read and Write to any database → Add User
4. **Network Access** (left sidebar) → **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`) → Confirm
5. **Databases** (left sidebar) → **Connect** → **Drivers** → Copy the connection string

It looks like:
```
mongodb+srv://tluser:<password>@cluster0.xxxxx.mongodb.net/
```

Replace `<password>` with your actual password and add `talentlaunch` at the end:
```
mongodb+srv://tluser:yourpassword@cluster0.xxxxx.mongodb.net/talentlaunch?retryWrites=true&w=majority
```

### Step 4 — Create the Environment File

In your project root, create a file called `.env.local` (not `.env`, not `.env.local.txt`):

**Windows (PowerShell):**
```powershell
New-Item -Path ".env.local" -ItemType File -Force
Add-Content -Path ".env.local" -Value "MONGODB_URI=mongodb+srv://tluser:yourpassword@cluster0.xxxxx.mongodb.net/talentlaunch?retryWrites=true&w=majority"
Add-Content -Path ".env.local" -Value "NEXTAUTH_SECRET=talentlaunch-super-secret-key-change-this-2025"
Add-Content -Path ".env.local" -Value "NEXTAUTH_URL=http://localhost:3000"
```

**Mac/Linux (Terminal):**
```bash
cat > .env.local << 'EOF'
MONGODB_URI=mongodb+srv://tluser:yourpassword@cluster0.xxxxx.mongodb.net/talentlaunch?retryWrites=true&w=majority
NEXTAUTH_SECRET=talentlaunch-super-secret-key-change-this-2025
NEXTAUTH_URL=http://localhost:3000
EOF
```

**Verify the file was created:**
```powershell
# Windows
type .env.local

# Mac/Linux
cat .env.local
```

You should see the 3 lines printed. If the file is not found, use Notepad/TextEdit manually and save as "All Files" with the name `.env.local`.

### Step 5 — Add AI API Key (Free — Groq)

1. Go to [console.groq.com](https://console.groq.com) → Sign up free (use Google or GitHub login)
2. Click **API Keys** → **Create API Key** → Copy it (starts with `gsk_...`)
3. Add to your `.env.local`:

```
GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 6 — Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the TalentLaunch landing page. Click **Get Started** to register your first account.

---

## 🔑 Environment Variables

Here is every variable your `.env.local` can contain:

```env
# ✅ REQUIRED — App will not start without these
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/talentlaunch?retryWrites=true&w=majority
NEXTAUTH_SECRET=any-long-random-string-at-least-32-chars
NEXTAUTH_URL=http://localhost:3000   # Change to your domain in production

# ✅ REQUIRED for AI features (free)
GROQ_API_KEY=gsk_...

# 🔵 OPTIONAL — AI fallback providers (if Groq fails, these are tried in order)
GEMINI_API_KEY=AIza...
COHERE_API_KEY=...
MISTRAL_API_KEY=...
OPENAI_API_KEY=sk-...

# 🔵 OPTIONAL — More job sources (all have free tiers)
ADZUNA_APP_ID=your_id
ADZUNA_APP_KEY=your_key
REED_API_KEY=your_key
RAPIDAPI_KEY=your_key
JOOBLE_API_KEY=your_key

# 🔵 OPTIONAL — Weekly email digest
RESEND_API_KEY=re_...
```

**Important rules:**
- No quotes around values (no `"` or `'`)
- No spaces around the `=` sign
- Always restart the dev server after changing `.env.local`

---

## 🆓 Free API Keys Setup

### Groq (AI — Primary, Required)
- **Free tier:** 14,400 requests/day, 600/hour
- **Model used:** Llama 3.3 70B
- **Get key:** [console.groq.com](https://console.groq.com) → API Keys → Create

### Gemini (AI — Fallback)
- **Free tier:** 1,500 requests/day
- **Get key:** [aistudio.google.com](https://aistudio.google.com) → Get API Key

### Cohere (AI — Fallback)
- **Free tier:** generous daily quota
- **Get key:** [cohere.com](https://cohere.com) → API Keys

### Adzuna (Jobs — 8 countries)
- **Free tier:** 250 requests/day
- **Coverage:** 🇮🇳 India, 🇬🇧 UK, 🇺🇸 USA, 🇦🇺 Australia, 🇩🇪 Germany, 🇨🇦 Canada, 🇸🇬 Singapore, 🇳🇿 New Zealand
- **Get key:** [developer.adzuna.com](https://developer.adzuna.com) → Register → App ID + App Key

### Reed UK (Jobs — UK market)
- **Free tier:** unlimited for registered developers
- **Get key:** [reed.co.uk/developers](https://reed.co.uk/developers) → Register

### JSearch via RapidAPI (Indeed + LinkedIn data)
- **Free tier:** 200 requests/month
- **Get key:** [rapidapi.com](https://rapidapi.com) → Search "JSearch" → Subscribe to free tier

### Jooble (Jobs — 140+ countries)
- **Free tier:** available
- **Get key:** [jooble.org/api/index](https://jooble.org/api/index) → Request API key

---

## 🚀 Running the App

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Check for TypeScript errors
npx tsc --noEmit
```

---

## 📱 All Pages & How to Use Them

### 🏠 Landing Page (`/`)
The public marketing page. Shows features, how it works, and pricing info. Click **Get Started Free** to create an account.

### 🔐 Register (`/register`)
Choose your role before registering:
- **Student 🎓** — full access to all job search, AI, and tracker features
- **Recruiter 💼** — can post jobs that appear for all students
- **Admin ⚡** — can manage all posted jobs and see platform stats

Fill in name, email, and password (min 6 characters). Account is created instantly.

### 🔐 Login (`/login`)
Enter your email and password. If no account exists with that email, you'll be redirected to register. If wrong password, you'll see an error.

### 📊 Dashboard (`/dashboard`)
Your home base after login. Shows:
- **XP bar** with your current level (Fresher → Tech Lead)
- **Stats cards:** jobs saved, applications, streak, badges
- **15-week heatmap** (GitHub-style activity grid)
- **Weekly goal tracker** — set a target (3/5/7/10 apps/week), see progress
- **AI Provider status** — which AI APIs are active (green dot = working)
- **Daily career tip** — rotates every day

### 🌍 Jobs (`/jobs`)
The main job search page. Four tabs:

**🌐 Live Jobs tab:**
1. Select your skills from the filter sidebar (AI/ML, Full Stack, MERN, Data Science, etc.)
2. Choose job type: Full-time, Internship, Remote
3. Click **Fetch Live Jobs** — pulls from all 20 sources simultaneously
4. Browse job cards (company, role, location, salary estimate, source badge, company rating ⭐)
5. Click any card to open the detail modal with Apply button, notes field, and save option

**🏢 Career Pages tab:**
30 major companies with direct links to their fresher/intern career pages. Filter by "Fresher Friendly" to see only companies that regularly hire freshers.

**📡 API Sources tab:**
Visual breakdown of all 20 job sources — which are active, how many jobs each provides, and links to get API keys for premium sources.

**🗓️ Deadlines tab:**
Add "apply by" dates to any job. Cards show urgency in red (overdue), orange (within 3 days), or yellow (within 7 days). Sorted by most urgent.

### 🌱 Fresher Hub (`/fresher`)
Built specifically for 0–2 year experience students. Four sections:

**Fresher Jobs:** Auto-filtered live jobs for freshers only. Toggle between all sources and India-specific sources.

**Off-Campus Drives:** Direct links and tips for:
- TCS National Qualifier Test (NQT)
- Infosys InfyTQ
- Wipro National Level Talent Hunt (NLTH)
- Google STEP Internship
- Microsoft MSIDC
- Amazon, Flipkart, Zomato off-campus drives

Each card shows expected package, eligibility, application period, and pro tips.

**Campus Placement Tracker:** See which top companies visit FAANG-level, product, and service company tiers, with typical visit months, packages, and CGPA cutoffs.

**Internship → FTE Tracker:** Log your internship details and track whether you received a Pre-Placement Offer (PPO). Fields: company, role, stipend, start date, mentor, PPO status (Pending / Received / Accepted / Declined).

### 🤖 AI Suite (`/ai`)
26 AI-powered tools in one page. Select any tool from the dropdown, fill in the inputs, and click Run. Results appear below with formatted output.

No API key input in the UI — the key is read securely from your server's `.env.local`.

Supports PDF resume upload: click **Upload Resume PDF** → select your resume → AI reads the text automatically.

See the [AI Tools Guide](#-ai-tools-guide-26-tools) section for details on every tool.

### 📄 Resume Builder (`/resume`)
5-step wizard:
1. **Personal Info** — name, email, phone, LinkedIn, GitHub, location, summary
2. **Skills** — add technical skills, tools, languages
3. **Experience** — job title, company, dates, bullet points (AI-enhance each bullet)
4. **Education** — degree, college, CGPA, years
5. **Projects** — project name, tech stack, description, GitHub link

After completing all steps:
- Click **Preview** to see a live HTML preview in the iframe
- Click **Download** to save as an HTML file (open in browser → print → save as PDF)
- Click **AI Enhance** on any bullet point to rewrite it to be more impactful

**Resume Version Manager:** Save different versions for different roles (e.g., "ML Engineer Resume", "Backend Dev Resume"). Switch between versions to load them into AI tools.

### 📊 Tracker (`/tracker`)
Three views:

**Kanban:** Drag applications between columns — Bookmarked → Applied → OA → Interview → Offer → Rejected. Each card shows company, role, date, and status.

**List:** Table view with inline status dropdown, salary, URL, notes column, and delete button.

**Analytics:** Application funnel chart, top hiring cities bar chart, weekly progress summary.

Click **+ Add Application** to log a new one. Fill in: company, role, status, salary (₹ LPA or $), deadline, contact, URL, notes. Click Save → +20 XP.

**Export to CSV:** Downloads all your applications as a spreadsheet importable into Notion, Google Sheets, or Excel.

### 📈 Analytics (`/analytics`)
Market insights powered by your job search data:
- **Weekly Progress Report:** Applied / Interviews / Offers this week vs last week with % change
- **Top Hiring Cities:** Bar chart of cities with most openings for your skills
- **Best Companies for Freshers:** Ranked list by combined score of salary + culture + WLB + fresher-hire rate
- **Salary Predictor:** Select skills + years of experience → see salary ranges for India / USA / Europe / Remote

### 🏆 Network (`/network`)
- **Badges:** View all 10 badges — earned ones are highlighted, locked ones show what's needed to unlock
- **Referral Finder:** Enter a target company → generates a LinkedIn search URL to find alumni + a personalised cold connection message template to copy
- **Streak & XP:** Your current streak (days with at least one action), total XP, and level

### 🌐 Community (`/community`)
- **XP Leaderboard:** Opt-in to compete. Submit your XP, see the top 10. Updated each session.
- **Achievement Share Card:** Click your milestone → generates a 1200×630 PNG → download and post to LinkedIn
- **Peer Resume Reviews:** Submit your resume text + self-score → others leave feedback. Browse existing reviews and leave feedback.
- **Interview Experience Board:** Share your interview rounds for any company. Upvote helpful experiences.
- **Referral Marketplace:** Post "I can refer at [Company]" or request a referral. Browse by company and skills.
- **Confessions Board:** 100% anonymous. Post rejections, offers, vents, or tips. Upvote what resonates.
- **Study Groups:** Create a group (skill + target company + meeting time + communication link) or join existing ones.

### 👤 Profile (`/profile`)
Your public career identity. Accessible at `talentlaunch.app/u/yourname` (requires setting a username).

Shows: avatar, bio, XP level, badges, skills, stats, GitHub/LinkedIn links, location.

**Ambassador Program:** Click **Get My Referral Code** → unique code generated. Share your link: `talentlaunch.app/register?ref=YOURCODE`. Milestones:
- 5 referrals → Campus Star badge (+100 XP)
- 15 referrals → Campus Lead badge (+300 XP)
- 30 referrals → Ambassador badge (+600 XP)

### 📚 Resources (`/resources`)
56 curated learning resources organised by category:
- **DSA:** Striver A-Z, NeetCode 150, LeetCode patterns
- **System Design:** Grokking, Alex Xu books, ByteByteGo
- **Projects:** Project ideas by role, GitHub repos, portfolio tips
- **Interview Prep:** Company-specific guides, Glassdoor experiences
- **Core CS:** OS, DBMS, CN, OOPs for placement rounds
- **Resume & Career:** ATS templates, LinkedIn guides, salary negotiation

Each resource shows: free/paid label, difficulty, estimated time, and a direct link.

### 💰 Salary Reports (`/salary`)
Anonymous crowdsourced salary data. Filter by company, role, city, year, and type (FTE/Intern/Contract). Upvote reports you find accurate. Submit your own package anonymously after getting an offer.

### 🔥 Resume Roast (`/roast`)
Paste your resume text. AI gives:
- Overall score out of 100
- 5 brutally honest (but constructive) roast lines about what's wrong
- Specific issues section (technical problems)
- Concrete fixes section (exactly what to change)

Generates a shareable red "roast card" PNG you can download and share on LinkedIn or Twitter for engagement.

### 🎙️ Voice Mock Interview (`/voice-interview`)
Uses the browser's free Web Speech API — no paid service needed.

1. Enter the job role you're interviewing for
2. Click **Start Interview**
3. AI speaks a question aloud (browser text-to-speech)
4. Click **Speak Answer** and answer verbally (browser speech recognition)
5. After all questions, get a scorecard: Communication · Technical Depth · Confidence · Clarity · Filler Words · Strengths · Improvements

### 🎓 TPO Portal (`/tpo`)
For Training & Placement Officers at colleges:
- Live placement drive calendar (TCS, Infosys, Wipro, Cognizant, HCLTech, Accenture, Deloitte, Capgemini)
- Student application statistics
- Embed code to add TalentLaunch job listings to your college website
- Contact form for partnership inquiries

### ⚡ Admin Panel (`/admin`)
Only accessible to accounts registered with the Admin role.
- Post new jobs (company, role, description, location, type, salary, apply link)
- View all admin-posted jobs
- Edit or delete any job
- Posted jobs appear immediately in the main Jobs page and Fresher Hub

### 🔗 Embed (`/embed`)
Generate an `<iframe>` embed code to show TalentLaunch job listings on any website:
- Theme: Dark / Light / Neon
- Job limit: 5 / 10 / 20 / 50
- Fresher-only toggle
- Copy the generated `<iframe>` tag and paste it into any HTML

---

## 🤖 AI Tools Guide (26 Tools)

All tools are in the AI Suite page. Select the tool from the dropdown menu, fill in the inputs, and click **Run**.

| # | Tool | What You Provide | What You Get |
|---|------|-----------------|--------------|
| 1 | **Resume Score** | Resume text | Score /100 with breakdown bars for 5 criteria |
| 2 | **Resume Rewriter** | Resume text | Full rewrite, ATS-optimised, ready to paste |
| 3 | **ATS Checker** | Resume text + job title | ATS pass/fail, missing keywords, score |
| 4 | **Job Match %** | Resume text + job description | % match, matching skills, missing skills |
| 5 | **Skill Gap Analyzer** | Resume text | Missing skills ranked by demand, learn-time estimates |
| 6 | **JD Analyzer** | Job description text | Red flags 🚩, green flags ✅, culture hints, difficulty rating |
| 7 | **Cover Letter** | Resume + job description + tone | Personalised cover letter (4 tones: Professional / Friendly / Enthusiastic / Concise) |
| 8 | **Cold Email** | Your name + target company + target role | Professional cold outreach email to hiring manager |
| 9 | **LinkedIn Post** | Achievement description + tone | Viral LinkedIn post with hook, body, CTA, hashtags |
| 10 | **LinkedIn Optimizer** | Your LinkedIn profile text | Rewritten headline, about section, experience bullets, tips |
| 11 | **Referral Email** | Your background + target company + contact name | Personalised referral request email |
| 12 | **Career Roadmap** | Your skills + target role | 5-year roadmap with titles, companies, salary progression |
| 13 | **Career Path Predictor** | Current role + skills | Year-by-year progression with salary ranges (India/US/EU) |
| 14 | **Dream Company Strategy** | Target company | Custom 3-month prep plan (Month 1: what to study, Month 2: build, Month 3: apply) |
| 15 | **Salary Negotiation Simulator** | Your offer details | Live multi-turn roleplay — AI is HR, you counter, get final score |
| 16 | **Mock Interview** | Target role | Live chat interview — AI asks questions, evaluates your answers |
| 17 | **Voice Mock Interview** | Target role | Speak your answers, AI grades pronunciation + content |
| 18 | **Interview Prep** | Target role | Technical + Behavioural + Role-specific Q&A + questions to ask interviewer |
| 19 | **Answer Grader** | Question + your answer | STAR format score 1–10, content score, model answer |
| 20 | **Follow-up Email** | Interview details | Professional thank-you + follow-up email draft |
| 21 | **Resume Roast** | Resume text | Brutal score + 5 roast lines + real issues + fixes (also available at `/roast`) |
| 22 | **GitHub Reviewer** | GitHub username | Profile score, top repo analysis, improvement suggestions |
| 23 | **Offer Comparison** | 2–3 offer details | Scored comparison table + recommended pick + reasoning |
| 24 | **Project Ideas** | Target role | 5 portfolio project ideas with tech stack, difficulty, impact, README tips |
| 25 | **Visa & Relocation** | Your skills | Top countries ranked by difficulty + timeline + expected salary |
| 26 | **Auto-Apply Draft** | Job description | Ready-to-submit application: cover letter + why this company + key talking points |

---

## 📡 Job Sources (20 Sources)

### Always Free (No API Key Needed) — 15 Sources

| Source | Coverage | Approx Jobs |
|--------|---------|-------------|
| Remotive | Remote tech worldwide, 6 skill categories | ~180 |
| Arbeitnow | Europe + remote, 3 pages | ~150 |
| Jobicy | Remote worldwide, 12 skill tags | ~150 |
| RemoteOK | Remote-only with salary data | ~60 |
| The Muse | US entry-level + intern | ~60 |
| Himalayas | Remote, skills-first | ~50 |
| Working Nomads | Developer nomad jobs | ~80 |
| DevITjobs | IT developer focused | ~50 |
| HN Who's Hiring | Real companies from monthly Hacker News thread | ~40 |
| We Work Remotely | RSS feed, 6 job categories | ~60 |
| Remote.co | Curated remote jobs RSS | ~30 |
| Jobspresso | Curated remote tech RSS | ~25 |
| Authentic Jobs | Design + dev RSS | ~20 |
| NoDesk | Remote worldwide RSS | ~25 |
| Remotive+ | Extra Remotive search endpoint | ~50 |

### Free with API Key — 2 Sources

| Source | Coverage | Get Key |
|--------|---------|---------|
| Jooble | 140+ countries, millions of listings | [jooble.org/api](https://jooble.org/api/index) |
| USAJobs.gov | US Government / federal tech jobs | [developer.usajobs.gov](https://developer.usajobs.gov) |

### Freemium (Free Tier Available) — 3 Sources

| Source | Coverage | Get Key |
|--------|---------|---------|
| Adzuna | 🇮🇳🇬🇧🇺🇸🇦🇺🇩🇪🇨🇦🇸🇬🇳🇿 8 countries | [developer.adzuna.com](https://developer.adzuna.com) |
| Reed UK | 280k+ UK jobs | [reed.co.uk/developers](https://reed.co.uk/developers) |
| JSearch | Indeed + LinkedIn data | [rapidapi.com](https://rapidapi.com) |

### Always Available — 80+ Curated Companies

Hardcoded career page links for:
- **Big Tech:** Google, Microsoft, Amazon, Meta, Apple, OpenAI, NVIDIA, Adobe, Salesforce
- **YC Startups:** Stripe, Vercel, Notion, Cursor, Supabase, Figma, Canva, Cohere, Hugging Face
- **India Ecosystem:** Razorpay, Swiggy, Zomato, CRED, Flipkart, PhonePe, Groww, Meesho, Dunzo, BrowserStack, Zoho, Freshworks
- **Europe:** Zalando, Booking.com, Revolut, Adyen, Spotify, Klarna
- **Remote-first:** GitLab, Automattic, Buffer, Scale AI, Toptal
- **Mass Hiring:** TCS, Infosys, Wipro, Cognizant, Accenture, Capgemini, HCLTech, Deloitte, Goldman Sachs, JP Morgan

---

## 👥 Role-Based Access

| Feature | Student 🎓 | Recruiter 💼 | Admin ⚡ |
|---------|-----------|-------------|---------|
| Browse all jobs | ✅ | ✅ | ✅ |
| Use AI tools | ✅ | ✅ | ✅ |
| Resume builder | ✅ | ✅ | ✅ |
| Application tracker | ✅ | ✅ | ✅ |
| Post jobs | ❌ | ✅ | ✅ |
| Admin panel | ❌ | ❌ | ✅ |
| Manage all jobs | ❌ | ❌ | ✅ |
| View platform stats | ❌ | ❌ | ✅ |

Role is selected at registration and stored in MongoDB. It cannot be changed after registration (contact admin).

---

## 🌐 Deploying to Production

### Option A — Vercel (Recommended for Next.js)

1. Push your code to GitHub (make sure `.env.local` is in `.gitignore`)
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Add all environment variables in the Vercel dashboard (Settings → Environment Variables)
4. Update `NEXTAUTH_URL` to your Vercel URL (e.g. `https://talentlaunch.vercel.app`)
5. Click Deploy

Every `git push` auto-redeploys. Free for hobby projects.

### Option B — Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Add env variables in the Railway dashboard. Your app URL: `yourapp.up.railway.app`. Free $5/month credit.

### Option C — Render

1. Go to [render.com](https://render.com) → New → Web Service → Connect GitHub
2. Build command: `npm install && npm run build`
3. Start command: `npm run start`
4. Add env variables → Deploy

Free tier available (app sleeps after 15 min idle).

**⚠️ For all platforms:** Update `NEXTAUTH_URL` to your production domain. Update MongoDB Atlas Network Access to allow all IPs (`0.0.0.0/0`).

---

## 🛠️ Troubleshooting

### "MONGODB_URI is missing" error
- Make sure `.env.local` exists in the project root (not `.env.local.txt`)
- Check there are no quotes around values
- Stop the server and restart: `Ctrl+C` then `npm run dev`
- Windows users: run `type .env.local` to confirm the file contents

### "Cannot connect to MongoDB"
- Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Network Access → confirm `0.0.0.0/0` is listed
- Check your password has no special characters that need URL encoding
- Try connecting with [MongoDB Compass](https://mongodb.com/products/compass) to test your URI

### Register/Login returns 500
- Check the terminal where `npm run dev` is running for the exact error message
- Ensure `NEXTAUTH_SECRET` is set (any random string, at least 32 characters)
- Delete the `.next` cache and rebuild:
  ```bash
  # Windows
  rd /s /q .next
  # Mac/Linux
  rm -rf .next
  npm run dev
  ```

### AI tools return no response
- Verify `GROQ_API_KEY` is set correctly in `.env.local` (starts with `gsk_`)
- Check [console.groq.com](https://console.groq.com) to confirm your key is active and within limits
- Add a Gemini key as fallback: `GEMINI_API_KEY=AIza...`

### Jobs not loading / "fetch to load"
- This is normal — some RSS APIs time out under 10 seconds
- Click **Fetch Live Jobs** again; different sources respond at different speeds
- Add optional API keys (Adzuna, Reed, JSearch) for more reliable job counts

### Build fails (`npm run build`)
- Run `npx tsc --noEmit` to see TypeScript errors
- Common cause: a page file is missing its default export
- Fix any errors shown, then rebuild

### PDF upload not working
- Make sure `pdf-parse` is installed: `npm install pdf-parse`
- The PDF must be text-based (not a scanned image). For scanned PDFs, paste the text manually.

---

## 📜 Version History

| Version | What Was Added |
|---------|---------------|
| **v1** | Chrome Extension — job search (Remotive, Arbeitnow, The Muse), AI resume matching with Anthropic API |
| **v2** | Groq API (free), Cover Letter Generator, Interview Question Predictor, Skill Gap Analyzer, Application Tracker with analytics |
| **v3** | Resume Builder, Gamification (XP, badges, levels), Referral Finder, Career Roadmap, Cold Email, Salary Estimator, LinkedIn Post Generator, More job sources |
| **v4** | Resume Score /100, Mock Interview, LinkedIn Optimizer, Hourly job alerts, Notes per job, Deadline reminders, 6 themes, Analytics tab, Chrome Side Panel |
| **v5 (Final — Web App)** | Converted to Next.js, Multi-AI provider fallback, 20 job sources, 26 AI tools, Voice Mock Interview, Resume Roast, Resume Version Manager, Public Profile, Campus Ambassador Program, Community (Leaderboard, Confessions, Study Groups, Referral Marketplace), Fresher Hub, Analytics page, Resource Library, Salary Reports, TPO Portal, Multi-language UI, PWA, Role-based auth (Student/Recruiter/Admin), Admin job posting |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — lightning-fast free AI inference
- [MongoDB Atlas](https://mongodb.com/atlas) — free cloud database
- [Remotive](https://remotive.com), [Arbeitnow](https://arbeitnow.com), [Jobicy](https://jobicy.com) — free job APIs
- [Next.js](https://nextjs.org) by Vercel — the best React framework
- All the freshers and CS students who inspired this project 🎓

---

*Built with ❤️ for CS freshers everywhere. If TalentLaunch helped you land your first job, share your story on the [Community Board](/community)!*
