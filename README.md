# postgresProject

User REST API built with [NestJS](https://nestjs.com/), Prisma and PostgreSQL. It supports listing users, fetching one user and signing up a new user. Started from the NestJS starter (originally with TypeORM) and refactored in 2026 to hash passwords, validate input and use a single Prisma connection pool.

## Tech stack

- Node.js >= 22.12, TypeScript 6
- NestJS 12 (`@nestjs/common`, `core`, `platform-express`, `config`)
- Prisma 7 with `@prisma/adapter-pg` and `pg` 8, PostgreSQL
- class-validator 0.15, class-transformer 0.5, bcrypt 6, helmet 8
- Jest 30 and supertest 7 for tests, ESLint 10 (flat config), Prettier

## Features

- Sign-up with bcrypt-hashed passwords (cost 12); password and email rules enforced by a global `ValidationPipe` (whitelist, reject unknown fields).
- Responses never include the password (only `id`, `email`, `name`).
- Paginated user list (`skip`, `take` up to 100, default 20).
- Duplicate email returns `409`; unknown user returns `404`; non-numeric id returns `400`.
- Helmet, CORS allow-list from `CORS_ORIGIN`, graceful shutdown hooks.

## Project structure

```
prisma/schema.prisma           User model (id, email, name, password)
prisma.config.ts               Prisma 7 config (database URL)
src/
  main.ts, setup-app.ts        bootstrap, helmet, CORS, pipes, filters
  app.module.ts
  db/                          global PrismaModule / PrismaService
  common/                      PrismaExceptionFilter (P2002 -> 409, P2025 -> 404)
  user/                        controller, service, DTOs, unit tests
  generated/                   generated Prisma client (gitignored)
test/                        e2e config and spec
```

## Setup

Prerequisites: Node.js >= 22.12 and a running PostgreSQL database.

```bash
npm install
cp .env.example .env
```

Environment variables (from `.env.example`; placeholders only):

| Variable | Example |
| --- | --- |
| `DATABASE_URL` | `postgresql://USER:PASSWORD@localhost:5432/postgres_project?schema=public` |
| `DATABASE_POOL_MAX` | `10` |
| `CORS_ORIGIN` | `http://localhost:4200` (comma-separated list) |
| `PORT` | `3000` |

No migration files are committed. Create the table from the schema with the Prisma CLI (for example `npx prisma db push`), or generate your own migrations and apply them with `npm run prisma:migrate`.

## Run

```bash
npm run build           # prisma generate + nest build
npm run start:dev       # watch mode
npm run start:prod      # node dist/main
```

`npm run start` and `npm run start:debug` also exist.

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Hello message |
| GET | `/user?skip=&take=` | List users (`skip` >= 0, `take` 1-100) |
| GET | `/user/:id` | Get one user (`400` if id is not an integer, `404` if missing) |
| POST | `/user` | Sign up. Body: `email` (valid, max 255), `name` (6-255 chars), `password` (8-72 chars) |

## Tests and lint

```bash
npm test                # unit tests (UserService)
npm run test:cov        # with coverage
npm run lint
npm run test:e2e        # see note below
```

## Notes and known limitations

- `test/app.e2e-spec.ts` is still the starter spec (`GET /` returns "Hello World!"), needs a reachable database, and does not cover the user endpoints.
- There is no authentication or login endpoint, only user creation and read.
- Any account created before the refactor may still have a plaintext password stored; the old schema had a default password.
