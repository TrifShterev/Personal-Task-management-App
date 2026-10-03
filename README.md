# TodAI

TodAI is a multi-page task manager built with Next.js App Router, TypeScript, Better Auth, Drizzle, and SQLite. Account and task workflows are separate server-rendered pages. Navigation uses ordinary links and form posts that redirect to a new document; the UI does not depend on client-side route transitions. Search filters the current user's tasks by title or description and retains the active query when paging through results.

## Requirements

- Node.js 22.13 or newer
- npm

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `BETTER_AUTH_SECRET` to a unique random value of at least 32 characters. Keep it private and do not reuse it in production.
3. Install dependencies with `npm install`.
4. Create and apply the database schema with `npm run db:generate` and `npm run db:migrate`.
5. Start the app with `npm run dev` and open `http://localhost:3000`.

The default database is `data/todai.db`, which is ignored by Git. Set `DATABASE_URL` to another `file:` URL for a different local path. For hosted libSQL, set `DATABASE_URL` and `DATABASE_AUTH_TOKEN` in the environment.

## Commands

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks
- `npm test` — run validation and SQLite repository tests
- `npm run auth:generate` — regenerate Better Auth's Drizzle schema after auth configuration changes
- `npm run db:generate` — create a Drizzle migration from schema changes
- `npm run db:migrate` — apply pending migrations

## Data and deployment

SQLite writes are asynchronous through libSQL, task list requests are paginated at 25 rows, and every task query is scoped to the current account. Migrations are checked into `drizzle/`; do not edit or delete the production database file to apply schema changes.

Keep a separate backup before upgrades or maintenance. For a local database, stop the app before copying the database file and any matching `-wal`/`-shm` files. Test a restore periodically. For hosted libSQL, use the provider's backup/export facility.

File-backed SQLite is intended for local development or a single Node.js instance with persistent writable storage. Do not deploy that file to an ephemeral serverless filesystem or share it between app instances. Choose a hosted libSQL endpoint or another shared database before deploying to those environments. Set `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` for the deployed origin.