# TalentLaunch: what went wrong, and what was improved

## A. What went wrong (found in the review)

| # | Problem | Why it mattered | Status |
|---|---------|-----------------|--------|
| 1 | Anyone could register as `admin` (role came from the sign-up request) | A stranger could post or delete jobs | Fixed: admin only via `ADMIN_EMAILS` |
| 2 | Login tokens fell back to the secret `'secret'` | Anyone could forge an admin token | Fixed: `NEXTAUTH_SECRET` is required |
| 3 | `/api/ai` was open to everyone, with no limit | Strangers could use up your free AI keys | Fixed: login required, 20 requests/min, size caps |
| 4 | `/api/parse-resume` had no login, size limit or safe errors | Large files and internal errors exposed | Fixed: login, 4 MB cap, rate limit, safe errors |
| 5 | `/api/digest` put user text straight into HTML | HTML injection in the email preview | Fixed: login required and all values escaped |
| 6 | Recruiter/admin jobs were kept in server memory | Lost on every restart or deploy | Fixed: saved in MongoDB |
| 7 | Jobs API called about 27 sources on every visit, with no overall deadline or cache | Slow page, "fetch to load" errors, timeouts on free hosting | Fixed: 7 s deadline per source, 10 min cache, recruiter jobs read directly from the database |
| 8 | Type errors hidden by `ignoreBuildErrors` (missing `@types/jsonwebtoken`) | Real bugs could ship silently | Fixed: types added, check turned on |
| 9 | 63 places parsed `localStorage` JSON without protection | One bad value could crash a whole page | Fixed: safe `readJSON` helper |
| 10 | Tracker, notes, XP and resume lived only in the browser | Lost on another device or after clearing the browser | Fixed: syncs to MongoDB (`/api/sync`) |
| 11 | About 3,900 lines of old commented-out code in the jobs route and 630 in the jobs page | Hard to read and maintain | Fixed: removed |
| 12 | Missing `MONGODB_URI` crashed with an unclear error; DB connect could hang | Confusing sign-up/login failures | Fixed: clear messages, 8 s connect timeout |
| 13 | Login/register had no rate limit; emails were case-sensitive | Password guessing, duplicate accounts | Fixed: 10 tries/min, emails lowercased |
| 14 | No PayPal integration, no `.env.example`, no lint config | Hackathon requirement missing, hard setup | Fixed: PayPal sandbox "Go Pro", `.env.example`, ESLint |

## B. New in this version
- **Job Match** page (`/match`): resume vs job description, with a percentage score.
- **Go Pro** page (`/upgrade`): PayPal sandbox checkout, server-side capture and check.
- Cross-device **sync** of the user's data.

## C. Still to improve (not done)
- Login token is kept in `localStorage`. HttpOnly cookies would be safer.
- Rate limits are in memory, so they reset on restart and do not share across servers. Use Redis/Upstash for a larger launch.
- Sync is "last writer wins" per key. It does not merge edits made on two devices at once.
- Pro only gives a badge and XP.
- No automated tests. Add tests for auth, PayPal capture and the jobs route.
- The Chrome extension is not in this repo; its CSP and duplicate `$` errors must be fixed in its own code.
- Many job sources need free API keys (see `.env.example`).

## D. How this was checked
- `tsc --noEmit` passes, `next build` passes, all 26 pages return 200.
- API checks: missing login is rejected, forged token is rejected, rate limits return 429, HTML in the digest is escaped, PayPal routes work against a mock PayPal server.
- **Not tested** (no database or PayPal access in the review environment): real sign-up/login, saving jobs, sync, and a real sandbox payment. Test these after setting your environment variables.

## E. UI/UX improvements (second round)
- **Consistent brand:** the sidebar said "GoUpfer.com"; it now says TalentLaunch.
- **Getting-started checklist** on the dashboard (resume, save a job, try an AI tool, track an application) with a progress bar. It disappears when finished or when the user hides it.
- **Jobs load automatically** the first time the page opens (no empty box with a button to click).
- **Sidebar grouped** into Jobs, AI Tools, Grow, Community and Account sections instead of one long list.
- **Phone layout fixed:** the dashboard pages were wider than the screen and cut off on the right. All pages now fit a 390 px wide phone. Jobs filters sit behind a "Filters & search" button on small screens.
- **Landing page** top bar no longer wraps on phones.
- **Friendlier wording:** "No AI key" is now "AI tools offline".
- **Accessibility:** visible keyboard focus, bigger tap targets in the sidebar, and support for the "reduce motion" setting.

## F. Third round
- **Pro now has a purpose:** free accounts get 15 AI runs per day, Pro accounts get 100 (`lib/quota.ts`). A run is given back if the AI providers fail. If the database is down, requests are allowed instead of blocked.
- **Friendly AI errors:** users see "The AI is busy, try again in a minute" instead of provider error text. Details go to the server log.
- **Match scores on every job card** with a "Best match for me" sort. Skills come from the profile and the saved resume. Jobs that name only one or two skills cannot reach 100%.
- Match logic is shared in `lib/match.ts` by the Jobs list and the Job Match page.
- Checked: unit tests for quota and match scoring pass; in a browser, badges appear, sorting puts the best matches first, and a user with no resume sees a hint to add one.
- Not tested here: counting AI runs in a real database, and the live PayPal payment.

## G. Professional color theme
The app now uses a royal blue, white and slate palette by default (the old neon look is still available as the "Dark" and "Neon" themes from the sidebar).
- Primary blue `#1D4ED8` for buttons, links and active items; dark navy `#0F172A` sidebar; page background `#F8FAFC`; white cards; slate text `#64748B`; borders `#E2E8F0`; green `#16A34A` for success.
- Gradients and glow effects were removed; one accent colour is used for actions.
- Accent text colours (green, red, amber, blue) are darker on white so numbers stay readable.
- The theme button cycles Professional, Dark, Neon. All colours come from CSS variables in `app/globals.css`, so changing the palette later means editing one block.

## H. Detailed profile page
`/profile` now has: header with level/XP, profile-strength meter, About, Education, Skills (chips), Projects, Experience, Links, Job preferences, Activity and badges, Account (plan, share card, referral link, data export). Saved to `tl_profile` in localStorage and synced to the account by the existing sync API; older keys are kept in step so other pages still work.

### H (update). Profile page is now a full 18-section profile
Tabs: Overview, Personal information, Professional summary, Education, Work experience, Skills, Projects, Certifications & achievements, Languages, Social links, Resume management, Job preferences, Career activity, AI career insights, Profile verification, Privacy, Notifications, Account settings. Data model and scoring live in `lib/profile.ts` (migrates the older simpler profile automatically). New APIs: `POST /api/account/password`, `DELETE /api/account` (both need login; delete needs the password).
Built honestly: scores are rule-based and explained on the page; verification shows "not available yet" instead of fake ticks; privacy and notification choices are saved but have no effect until recruiter-facing profile views and email/push delivery exist.
Not built: public profile URL/page, cover image upload, certificate file upload, DOCX resume upload, 2FA, login history/sessions, connected accounts, password reset by email.

## I. Clerk as a secondary sign-in
Email/password stays the main login. If `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set, login and register show a "Continue with Google or other options" button to `/clerk-login`. After Clerk signs the visitor in, `POST /api/auth/clerk` verifies the Clerk session on the server, requires a Clerk-verified email, links to (or creates) the TalentLaunch user with that email, and returns the same token as normal login. Without the keys the button is hidden and the route returns 501. Next.js was bumped (see section J).
Setup: create a Clerk app, enable the providers you want (Google, GitHub), copy the two keys into `.env.local` and your host's env vars, and add your site URL under Clerk's allowed origins.


## J. Security audit and fixes (full pass)

**Found and fixed**
| # | Problem | Fix |
|---|---|---|
| 1 | **Stored XSS**: job, tracker, study-group and TPO links went straight into `href`. A self-registered "recruiter" could post `javascript:` links that run in every visitor's session (tokens live in localStorage). | New `lib/safeUrl.ts` (http/https only) used on every external link, and the job API now rejects non-http(s) links. |
| 2 | Vulnerable dependencies: 8 advisories (2 critical). `next-auth` was installed but never used. | Removed `next-auth`; `mongoose`, `lodash`, `nanoid`, `uuid`, `source-map-js` updated; **Next.js 14.2.5 to 15.5.x** and React 19 (fixes the Next.js advisories that apply to 14). |
| 3 | Mass assignment: `POST /api/admin/jobs` saved the whole request body (`strict:false`), so any field could be set. | Allow-list of fields, length caps, tag limits, rate limit. |
| 4 | `DELETE /api/admin/jobs` accepted any `id` type (NoSQL operator object) and compared owner IDs with `!==`. | Must be a valid ObjectId string; owner compared as strings. |
| 5 | JWT: algorithm not pinned, claims not checked, weak secrets accepted. | HS256 only, `userId` and a known `role` required, 16+ character secret enforced in production. |
| 6 | Login/register trusted request types (object passwords, no email check, 6-char passwords, bcrypt 72-byte cut-off). | Type checks, email format, 8 to 72 character passwords, field length caps, safe JSON parsing. |
| 7 | Sync accepted any `tl_*` key name (dots or `$` break MongoDB). | Key pattern `tl_[a-z0-9_]{1,60}`, max 200 keys. |
| 8 | Resume upload checked only the `.pdf` extension. | Also checks the `%PDF-` file signature. |
| 9 | No security headers. | CSP (own code + PayPal, Clerk, Google Fonts only), `frame-ancestors 'none'`, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS in production, `X-Powered-By` removed. `/embed/*` stays embeddable. |
| 10 | Rate-limiter memory grew forever; client IP read only from `x-forwarded-for`. | Old entries swept and size capped; prefers `x-real-ip`. |

**Bugs fixed along the way**
- Root layout had **two `<head>` tags** (invalid HTML, build error on Next 15): merged.
- Job posting form sent `url`, `isRemote`, `isFresher` but the model only knew `applyUrl`: all now stored and returned.
- Embed page: hydration mismatch (React error 425) because the origin was read during render; also the iframe size fields are now validated.
- The embed snippet pointed to `/embed/jobs`, a page that did not exist: added a public, read-only widget page.
- Register form said "6 characters"; now matches the 8-character rule.
- 3 lint warnings (hook dependencies, `<img>`): `next lint` now reports zero.

**Tested** (against the built app): 34 API checks pass: forged/expired/`alg:none`/wrong-secret tokens, missing claims, wrong role, oversized and malformed bodies, operator-injection payloads, every protected route without a token, rate limiting, security headers; `safeUrl` against 11 hostile inputs; all 28 pages load on desktop and phone with no console errors; profile edit/save/reload works on React 19.

**Not done / residual (be aware)**
- `npm audit` still lists `next` (moderate) and `postcss` (high, inside Next's build tooling). The remaining fixes need Next 16. The app does not use Server Actions, rewrites, middleware or the image optimizer, which is where most of those advisories sit.
- Rate limits are per server instance; on serverless hosting use a shared store (Upstash Redis).
- Not testable here (no database, PayPal or internet): real registration/login, ownership checks on job deletion against live data, a live PayPal payment.
- The Chrome extension code is not in this repository, so it was not audited.


## K. Sessions moved to an httpOnly cookie (closes two gaps from section J)
- **Cookie, not localStorage.** Login, register and Clerk sign-in set `tl_session` (httpOnly, SameSite=Lax, Secure in production, 30 days). The token is no longer returned to the page or stored in localStorage, so an XSS bug cannot steal it. Old `tl_token` values are deleted on first load.
- **CSRF defence.** A request authenticated by the cookie that changes data must come from our own site (Origin or Sec-Fetch-Site check). Scripts can still use an `Authorization: Bearer` header.
- **Revocable sessions.** Users have a `tokenVersion`. Changing the password signs out every other device (this one stays signed in); new "Log out everywhere" button in Profile, Account settings; deleting the account clears the cookie. Routes that change data or money (jobs, sync, PayPal, account) now also check the user still exists and read the role from the database, so demotions apply immediately.
- **New routes:** `GET /api/auth/me` (the page asks "who am I?", because it cannot read the cookie) and `POST /api/auth/logout` (`{all:true}` revokes every session).
- Dashboard layout: sends you to /login if the server says the session is invalid; if the database is unreachable it keeps you signed in instead of logging you out.
- **Tested:** 12 checks against the built app (cookie accepted, forged cookie rejected, foreign-origin and no-origin writes refused, bearer still works, /me and logout behaviour, DB-down behaviour) and the cookie flags; all 28 pages load with a cookie session; a stale session with no cookie is sent to /login. **Not tested:** a real login/register round trip and "Log out everywhere" (no database here).
- Note: existing users will have to log in once more after this update.

## L. Full feature test (real MongoDB, browser)
Tested against a real MongoDB (3.6 binary with Mongoose 7 in a test copy; production code uses Mongoose 8), a mock PayPal server and a fake AI provider.
**API, 69 checks, all pass:** register/login/logout, duplicate and case-insensitive emails, role escalation blocked, `ADMIN_EMAILS`, cookie session, CSRF, `/me`, change password (other devices signed out), log out everywhere, delete account, sync (filtering, size limit), recruiter job post/list/delete with ownership and admin override, protected fields, operator injection, `javascript:` links, `/api/jobs` feed includes recruiter jobs, AI answer, free quota (15, then 429), failed-run refund, Pro quota, PayPal create/capture/reuse/wrong-owner, digest escaping, real PDF parsing, image-only PDF, fake and Word files.
**Browser:** register through the form, httpOnly cookie, dashboard, jobs list and links, tracker add/reload, job match, AI suite, resume PDF upload and score, profile edit/save/reload, cross-device sync, wrong-password error, log out everywhere, protected-page redirect, recruiter posting from the admin page.
**Bugs found by this test and fixed**
1. **Resume upload returned PDF internals as "resume text"** for many real PDFs (old `pdf-parse` failed with "bad XRef entry", then a raw-text fallback dumped file structure). Now uses `unpdf` first, `pdf-parse` second, and an unreadable/scanned PDF gives a clear 422 instead of garbage.
2. **Cross-device sync lost edits**: changes made before a reload or closed tab were never sent, because the baseline was the local data instead of the server data. Fixed; the server also now merges instead of replacing, so a new device cannot wipe keys it has not loaded.
3. `next.config.js` used a Next 14 option name (`experimental.serverComponentsExternalPackages`); renamed for Next 15 (`serverExternalPackages`), which removes a startup warning and keeps Mongoose external.
**Not testable here:** live PayPal sandbox payment and the PayPal button, real AI providers, live job sources (offline: the feed fell back to curated jobs), Clerk sign-in, microphone features (voice interview), email delivery, the Chrome extension (not in this repo).
