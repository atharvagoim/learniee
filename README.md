# Learniee

A full-stack ed-tech take-home built for parents to search, filter, and discover courses for
their children. Real authentication, a server-driven course catalog of 450 courses, and a
dashboard designed to feel like a premium SaaS product rather than a CRUD demo.

## Project Overview

Learniee is a parent-facing course discovery app. Parents create an account, land on a
personalized dashboard, and search/filter/sort a catalog of 450 real-feeling courses across
29 subjects, 13 grade levels, and 60 teachers — all backed by real server-side search,
filtering, sorting, and pagination.

## Features

- Email/password signup and login with secure, hashed passwords
- Session-based auth via HTTP-only cookies, server-enforced route protection
- Parent dashboard with a personalized greeting and hero search
- Debounced (300ms) server-side search across title, subject, and teacher name
- Combinable filters: Grade, Subject, Price range, Teacher rating
- Sorting: Recommended, Price (low→high / high→low), Rating, Newest
- Server-side pagination (12 courses/page) with First/Last/disabled-state handling
- Search, filters, sort, and page are all persisted in the URL (shareable/refreshable)
- Removable active-filter chips with a "Clear all" action
- Animated skeleton loading states, an empty state, and human-readable error states
- Toast notifications for key actions (login, signup, logout, errors)
- Mobile filter drawer (bottom sheet) with focus handling and body-scroll lock
- Course detail page with Add to Cart / Buy Now actions
- Favorites (wishlist) with a heart toggle on every course, backed by a real `Favorite` table
- Personalized "Recommended for you" row based on favorited subjects
- Cart + checkout flow: `/cart`, `/checkout` (payment method selection, promo codes,
  optional child name), and an order confirmation page at `/orders/[orderNumber]` — this is a
  demo checkout for a portfolio project, so no real payment is collected or processed and no
  card details are requested
- Order history at `/orders`, with ownership checks (one parent can't view another's order)
- Account page with an editable name and profile stats
- Mobile-first responsive design throughout, including sticky bottom action bars on cart and
  course-detail pages, `env(safe-area-inset-bottom)` handling for devices with a home
  indicator, and snap-scrolling horizontal course rows
- Full keyboard navigation, visible focus states, `prefers-reduced-motion` support

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** for styling, with a small custom design-token layer
- **SQLite** via Node's built-in **`node:sqlite`** module (see "A note on Prisma and
  better-sqlite3" below)
- **bcryptjs** for password hashing, custom session-cookie auth (no third-party auth library)
- **Zod** for request validation
- **Framer Motion** for the animation system, **Lucide React** for icons

## A note on Prisma and better-sqlite3

The assignment spec calls for Prisma ORM. This build was produced inside a sandboxed
environment whose network allowlist does **not** include `binaries.prisma.sh` — the host
Prisma's CLI needs to download its query/schema engine binaries from. Every attempt to run
`npx prisma generate` or `prisma init` failed with a `403 host_not_allowed` before any code
could even be generated, which meant Prisma could not be used at all here, let alone tested.

The first replacement I tried was `better-sqlite3`, a native SQLite binding. That works fine
in the sandbox (it has a prebuilt binary for that platform/Node combination), but it requires
a **native compile step** (`node-gyp`) on any machine where a matching prebuilt binary isn't
available — which is exactly what happened on Windows with a very new Node version, producing
`Could not find any Visual Studio installation to use`. Rather than ask you to install the
"Desktop development with C++" Visual Studio workload just to run a take-home assignment, I
switched to **`node:sqlite`** — the SQLite driver **built into Node.js itself** (stable since
Node 22.5+, no install, no native compile, no Visual Studio). It has an API almost identical
to `better-sqlite3` (`db.prepare(...).run/get/all(...)`), so nothing about the app's behavior
changed — only the import in `src/lib/db.ts`. Node will print one harmless line on startup
(`ExperimentalWarning: SQLite is an experimental feature...`) — that's expected and does not
affect functionality.

Behind a small repository-style data layer (`src/lib/db.ts`, `src/lib/auth.ts`,
`src/lib/courses.ts`) it mirrors what a Prisma-based layer would look like: typed queries,
parameterized SQL (no injection risk), indexes on every frequently-filtered column, and a
single schema-init function. It's still real SQLite, still server-side, still fully indexed —
just not the Prisma client specifically.

If you'd like to swap in Prisma on a machine with normal network access, the path is
straightforward:
1. `npm install prisma @prisma/client`, `npx prisma init --datasource-provider sqlite`
2. Recreate the `User`, `Session`, `Course` models from `src/lib/db.ts`'s schema in
   `prisma/schema.prisma` (fields line up 1:1)
3. Replace the query functions in `src/lib/courses.ts` and `src/lib/auth.ts` with
   `prisma.course.findMany(...)` / `prisma.user.create(...)` equivalents
4. Rewrite `scripts/seed.ts` to use `prisma.course.createMany(...)`

## Architecture

- **Frontend**: App Router pages under `src/app`, with client components only where
  interactivity is needed (search/filter state, animations). Server components handle auth
  checks and initial data loads (e.g. `dashboard/page.tsx`, `course/[slug]/page.tsx`).
- **API**: Route handlers under `src/app/api/**/route.ts`. All input is validated with Zod
  before touching the database. Errors return human-readable JSON messages, never raw
  stack traces.
- **Authentication**: `src/lib/auth.ts` handles password hashing (bcrypt), session creation/
  lookup/expiry, and HTTP-only cookie management. `src/proxy.ts` (Next 16's renamed
  middleware convention) enforces route protection at the edge — unauthenticated users are
  redirected away from `/dashboard`, and authenticated users are redirected away from
  `/login` and `/signup`.
- **Database**: SQLite file at `.data/dev.db` (created automatically on first run), accessed
  synchronously via Node's built-in `node:sqlite` module. The folder is dot-prefixed and uses
  SQLite's default (non-WAL) journal mode specifically to avoid a `next dev` reload loop —
  see "Troubleshooting" below for why. Schema and indexes are defined in `src/lib/db.ts` and
  created automatically on first import.
- **Search**: `src/lib/courses.ts` builds a single parameterized SQL query from the
  validated filter/search/sort/page input and returns both the page of results and
  pagination metadata (`page`, `pageSize`, `total`, `totalPages`).

## Database

SQLite, accessed via Node's built-in `node:sqlite` module (`DatabaseSync`). Three tables:
`User`, `Session`, `Course`, with indexes on `Course.subject`, `Course.grade`, `Course.price`,
`Course.teacherRating`, `Course.title`, `Course.teacherName`, `Course.createdAt`, plus
`Session.userId` and `Session.expiresAt`.

Example course row:

```json
{
  "title": "Python Programming for Young Minds",
  "subject": "Python",
  "grade": "Grade 8",
  "price": 3999,
  "teacherName": "Rahul Mehta",
  "teacherRating": 4.9
}
```

## Seed Data

Running the seed script generates:

- **450 realistic courses** (deterministic — a seeded PRNG means re-running produces the
  same shaped dataset every time)
- **60 unique teachers**, each with 2–4 subject affinities so no single teacher is
  overloaded and every subject has multiple possible instructors
- **29 subjects** across STEM, humanities, languages, arts, and exam prep
- **13 grade levels**, Kindergarten through Grade 12, with subject availability scoped to
  age-appropriate grade ranges (e.g. Artificial Intelligence starts at Grade 7, Drawing tops
  out at Grade 8) — this is also what makes some filter combinations (like Kindergarten +
  Artificial Intelligence) correctly return zero results, so the empty state is genuinely
  reachable
- Realistic price points (₹499–₹9,999), ratings (3.5–5.0, not clustered at the top), and
  review counts (12–420)

Verified test combinations (see `Test Search`/`Test Filters` below for the full list):
Grade 8 + Computer Science → 2 results · Grade 10 + Mathematics + 4.5★+ → 1 result ·
Grade 6 + Science + under ₹2,500 → 1 result · Kindergarten + Artificial Intelligence → 0
results (empty state).

## Demo Credentials

```
Email:    demo@learniee.com
Password: Demo@12345
```

## Local Setup

Requires **Node.js 22.5 or later** (for the built-in `node:sqlite` module — check with
`node -v`; if you're on an older Node, install the current LTS from nodejs.org first).

```bash
npm install
npm run db:seed   # generates .data/dev.db with 450 courses + the demo account
npm run dev
```

Then open `http://localhost:3000`. Re-running `npm run db:seed` at any time safely wipes and
regenerates the catalog (it clears `Course`, `Session`, and `User` tables first).

To verify the production build:

```bash
npm run build
npm run start
```

## Deployment

**Important constraint first:** this app stores its data in a local SQLite file
(`.data/dev.db` by default). That's perfect for a normal server process with a persistent
disk, but it does **not** work on serverless/edge platforms like Vercel or Netlify Functions
— those run your code in ephemeral, isolated containers with a read-only filesystem (except
a `/tmp` that's wiped between invocations and not shared across instances), so a local SQLite
file can't persist there. Deploy this to any platform that runs your app as a normal
long-lived Node process with a persistent disk. Three good options below; pick whichever
fits your budget/familiarity. If you specifically want Vercel, see the note at the end.

### Option A — Render (easiest, has a free-tier-friendly path)

A ready-to-use `render.yaml` blueprint is included at the project root — it provisions a web
service plus a small persistent disk mounted at `/data` for the database.

1. Push this project to a GitHub/GitLab repo.
2. In the Render dashboard: **New → Blueprint**, point it at your repo. Render will read
   `render.yaml` automatically and provision the service + disk for you.
3. Click **Apply** / **Create Web Service**. The first deploy runs `npm install && npm run
   build`, then starts with `npm run start:prod` — which seeds the 450 courses + demo account
   **only if the database is empty**, so later redeploys never wipe your data.
4. Once live, Render gives you a `https://<your-service>.onrender.com` URL. Add a custom
   domain under the service's **Settings → Custom Domains** if you want one.

If you'd rather configure it by hand instead of using the blueprint: Node web service,
build command `npm install && npm run build`, start command `npm run start:prod`, add a
persistent disk mounted at `/data`, and set the environment variables `NODE_ENV=production`
and `LEARNIEE_DB_PATH=/data/dev.db`.

### Option B — Railway

1. Push the project to GitHub, then in Railway: **New Project → Deploy from GitHub repo**.
2. Railway auto-detects Node via `.nvmrc`/`package.json`'s `engines` field. Set the **Build
   Command** to `npm install && npm run build` and the **Start Command** to
   `npm run start:prod`.
3. Add a **Volume** (Railway's persistent disk feature) mounted at, say, `/data`.
4. Add environment variables: `NODE_ENV=production` and `LEARNIEE_DB_PATH=/data/dev.db`.
5. Deploy. Railway assigns a public URL automatically; add a custom domain under the
   service's **Settings → Domains** if needed.

### Option C — Your own VPS (DigitalOcean, EC2, Lightsail, etc.) — most control

1. Provision an Ubuntu (or similar) server and SSH in.
2. Install Node 22+ (e.g. via [nvm](https://github.com/nvm-sh/nvm)) and `git`.
3. Clone the repo, then:
   ```bash
   npm install
   npm run build
   npm run db:seed        # first time only
   ```
4. Run it as a background service with a process manager, e.g. [pm2](https://pm2.keymetrics.io/):
   ```bash
   npm install -g pm2
   pm2 start "npm run start" --name learniee
   pm2 save
   pm2 startup   # follow the printed instructions to survive reboots
   ```
5. Put Nginx (or Caddy) in front as a reverse proxy to `localhost:3000`, and terminate HTTPS
   there (Caddy does this automatically; with Nginx use `certbot` for a free Let's Encrypt
   cert). This matters for auth specifically: the session cookie is marked `secure` in
   production (see `src/lib/auth.ts`), so the browser will only send it back over HTTPS.
6. Point your domain's DNS at the server, and you're done. To deploy an update later:
   `git pull && npm install && npm run build && pm2 restart learniee`.

### Environment variables (all optional, all platforms)

| Variable | Purpose | Default |
|---|---|---|
| `NODE_ENV` | Set to `production` for real deployments — enables the `secure` cookie flag | unset |
| `LEARNIEE_DB_PATH` | Absolute path to the SQLite file. Point this at your persistent disk/volume mount. | `.data/dev.db` in the project root |
| `PORT` | Which port `next start` listens on | `3000` (Next reads `PORT` automatically) |

### If you specifically want Vercel/Netlify (serverless)

You'll need to swap the data layer to a hosted database that works over the network instead
of a local file — e.g. [Turso](https://turso.tech) (hosted libSQL, very close to SQLite's own
API) or a hosted Postgres (Neon, Supabase) via Prisma. That's a real code change in
`src/lib/db.ts`, `src/lib/courses.ts`, `src/lib/auth.ts`, and `scripts/seed.ts` — ask if you'd
like help making that swap.

## Troubleshooting

**`npm run dev` keeps reloading the page in a tight loop, over and over, with no edits.**
This was a real bug hit during development and is now fixed. The actual cause: `/dashboard`
is a fully dynamic route (it checks the session cookie on every request), and the dashboard's
"keep search/filters/sort/page in the URL" effect was calling `next/navigation`'s
`router.replace(...)`. On a dynamic route, every `router.replace()` call makes Next.js fetch a
fresh server-rendered payload for the page — a real round-trip to the server, logged as
`GET /dashboard`. That effect re-running (on every search/filter/sort/page change, and
potentially on every render if anything caused a remount) meant continuous server requests
that looked exactly like an endless reload loop. The fix (already applied in this project):
the URL is now updated with the browser's native `window.history.replaceState(...)` instead
of `router.replace(...)` — this is Next.js's own documented pattern for updating the address
bar without triggering navigation or a server fetch (see their docs on "Using the native
History API"). If you're on an old copy showing this symptom, check that
`src/app/dashboard/components/dashboard-client.tsx` uses `window.history.replaceState` and
not `router.replace` in its URL-sync effect.

(An earlier attempt at this fix moved the SQLite database into a dot-prefixed `.data/` folder
and turned off WAL journal mode, on the theory that database file writes inside a watched
directory were triggering Fast Refresh. That change is harmless and still in place — it's
good practice regardless — but it turned out not to be the actual cause, which is the
`router.replace()` behavior described above.)

**`npm install` fails on `better-sqlite3` with a `node-gyp`/Visual Studio error on Windows.**
This project doesn't depend on `better-sqlite3` — it uses Node's built-in `node:sqlite`
module, which needs no native compilation. If you still see this error, you likely have a
stale `node_modules`/`package-lock.json` from an older copy of the project; delete both and
run `npm install` again.

## Assumptions

- Prisma → better-sqlite3 substitution, documented above, due to sandbox network
  restrictions during development.
- `next/font/google` was not used (same network restriction blocks `fonts.googleapis.com`
  in this build environment); a deliberate system-font stack is used instead. This has no
  effect on the app itself and can be swapped for a Google Font on a normal network.
- Course "duration" and "lessons" are generated together (e.g. a 12-week course gets ~36
  lessons ± a small variance) rather than fully independent fields, since that's how a real
  catalog would be structured.
- Enrolment/payment is out of scope per the assignment brief — the "Enrol now" button on the
  course detail page is presentational only.
- Session duration is 7 days; sessions are stored server-side and can be revoked by deleting
  the row (used on logout), rather than relying solely on cookie expiry.

## Test Search

Verified case-insensitive, non-empty results for: `math`, `science`, `python`, `coding`,
`english`, `physics`, `biology`, `robotics`, `AI` (via `Artificial Intelligence`/`Programming`
matches), `chemistry`.

## Test Filters

Grade, Subject, Price, and Rating filters were each verified individually and in combination,
including the specific combinations called out in the brief (Grade 8 + Computer Science;
Grade 10 + Mathematics + 4.5★+; Grade 6 + Science + under ₹2,500; Grade 12 + Physics + 4.7★+;
Grade 9 + Chemistry + ₹1,000–₹5,000), plus at least one combination that correctly returns
zero results (Kindergarten + Artificial Intelligence) to exercise the empty state.

## Test Pagination & Sorting

Verified First/Previous/Next/Last behavior, disabled states at the boundaries, correct
`totalPages` for 450 rows at 12/page (38 pages, last page has 6 items), and that filters/
search/sort persist across page changes. Verified `price_asc`, `price_desc`, and
`rating_desc` return correctly ordered results.

## Test Authentication

Verified: signup, duplicate-email rejection (409), login, wrong-password rejection (401),
session persists across refresh (HTTP-only cookie), logout clears the session, `/dashboard`
redirects unauthenticated visitors to `/login`, and authenticated visitors are redirected
away from `/login`/`/signup` back to `/dashboard`. The demo account was verified end-to-end.

## Production Build Status

`npm run build` completes successfully (TypeScript check, ESLint, and static generation all
pass with zero errors and zero warnings).

## What I Would Improve

- Swap better-sqlite3 back for Prisma + Postgres in a production deployment, plus connection
  pooling (e.g. via PgBouncer) for serverless environments
- Redis-backed sessions instead of SQLite-backed sessions at higher scale
- Email verification and a proper password-reset flow
- Multiple child profiles per parent account, with per-child saved searches/wishlists
- Real course enrolment and payments (Razorpay/Stripe)
- A lightweight recommendation model based on browsing/search history
- Favorites/wishlist and a "Continue where you left off" section
- Move seeded images to a CDN/object storage instead of a placeholder image service
- Product analytics (search terms with zero results, drop-off in the filter funnel) and
  basic uptime/error monitoring
- Automated tests (unit tests for the query-builder in `lib/courses.ts`, integration tests
  for the auth API routes, and a Playwright smoke test for the signup → search → filter →
  paginate flow) and CI/CD
