# Avalon

A production-ready Express.js + TypeScript + Prisma backend template designed for rapid project bootstrapping without premature complexity.

## Stack

- **Runtime & Framework:** Node.js, Express.js, TypeScript
- **Database & ORM:** PostgreSQL, Prisma
- **Authentication:** JWT Bearer tokens (`jsonwebtoken`) & API key guards
- **Logging:** Winston with daily log rotation
- **Scheduling:** `node-cron` with graceful shutdown job tracking
- **Documentation:** OpenAPI 3 (`src/docs/openapi.yaml`) served via Swagger UI at `/docs`
- **Testing:** Vitest + Supertest

---

## Project Structure

```text
src/
├── config/          # Environment validation and app configuration
├── docs/            # OpenAPI specification (openapi.yaml)
├── error/           # OpenAPI specification (openapi.yaml)
├── integrations/    # Third-party external API clients (e.g. OpenWeather)
├── lib/             # Shared singletons (Prisma client)
├── middlewares/     # Auth, API key, Helmet/CORS, request logger, 404 & global error handler
├── modules/         # Feature modules (authentication, health, weather, etc.)
├── utils/           # Custom AppError hierarchy and Winston logger
├── app.ts           # Express app setup, security middleware, and routes
└── server.ts        # HTTP server binding, cron scheduling, and graceful shutdown
tests/
└── app.smoke.test.ts # Baseline smoke tests for health, errors, and auth guards
```

---

## Quick Start

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url> my-service
cd my-service
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

| Variable       | Description                                               | Example                                       |
| :------------- | :-------------------------------------------------------- | :-------------------------------------------- |
| `NODE_ENV`     | Runtime environment (`development`, `production`, `test`) | `development`                                 |
| `APP_NAME`     | Service identifier used in startup logs                   | `avalon`                                      |
| `PORT`         | HTTP port for the Express server                          | `3000`                                        |
| `DATABASE_URL` | PostgreSQL connection string                              | `postgresql://user:pass@localhost:5432/mydb`  |
| `JWT_SECRET`   | Secret key used to sign and verify Bearer tokens          | `change-me-in-production`                     |
| `API_KEY`      | Shared key for `requireApiKey` protected routes           | `your-service-api-key`                        |
| `CORS_ORIGIN`  | Comma-separated list of allowed frontend origins          | `http://localhost:5173,http://localhost:3000` |

### 3. Initialise Database (Prisma)
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Server
```bash
npm run dev
```
- **API Base URL:** `http://localhost:3000/api/v1`
- **Health Check:** `http://localhost:3000/health`
- **Swagger Docs:** `http://localhost:3000/docs`

---

## Available Scripts

| Command              | Description                                           |
| :------------------- | :---------------------------------------------------- |
| `npm run dev`        | Starts the development server with live reload        |
| `npm run build`      | Compiles TypeScript into `dist/`                      |
| `npm start`          | Runs the compiled production build (`dist/server.js`) |
| `npm test`           | Runs the Vitest + Supertest smoke test suite          |
| `npm run test:watch` | Runs tests in interactive watch mode                  |

---

## Architecture & Conventions

- **Consistent Error Contract:** All operational errors extend `AppError` (`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`) and resolve through `errorHandler` as `{ "success": false, "message": "..." }`.
- **Clean Separation of `app.ts` & `server.ts`:** `app.ts` configures middleware and routes without binding to a network port, allowing Supertest to execute in-memory tests cleanly without triggering background cron tasks.
- **Graceful Shutdown:** `server.ts` intercepts `SIGTERM` and `SIGINT`, stops scheduled cron triggers, waits for any active background job and in-flight HTTP requests to complete, and disconnects Prisma before exiting.
- **Baseline Security:** Enforces Helmet HTTP security headers (with relaxed CSP on `/docs`), `.env`-driven CORS allowlists, and a `1mb` JSON payload limit.

---
## Error Handling

All failed requests return a consistent JSON contract:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Custom Error Classes (`src/error/app-error.ts`)

Throw these inside controllers or services—`errorHandler` catches them automatically:

| Class               | HTTP Status | When to Use                                                  |
| :------------------ | :---------- | :----------------------------------------------------------- |
| `BadRequestError`   | `400`       | Invalid input, missing fields, or failed business validation |
| `UnauthorizedError` | `401`       | Missing, expired, or invalid JWT / API key                   |
| `ForbiddenError`    | `403`       | Authenticated user lacks permission for the resource         |
| `NotFoundError`     | `404`       | Requested database record does not exist                     |
| `ConflictError`     | `409`       | Duplicate entry (e.g. email already registered)              |

### Built-in Global Fallbacks

- **Malformed JSON (`400`):** Invalid JSON bodies caught by `express.json()` return `{ "success": false, "message": "Invalid JSON payload" }`.
- **Unregistered Routes (`404`):** Any unmatched endpoint hits `notFoundMiddleware` and returns `{ "success": false, "message": "Not found" }`.
- **Unhandled Exceptions (`500`):** Unexpected crashes are logged in full via Winston while returning a safe `{ "success": false, "message": "Internal server error" }` without exposing stack traces.

## Available Scripts

| Command              | Description                                                      |
| :------------------- | :--------------------------------------------------------------- |
| `npm run dev`        | Starts the development server with live reload (`tsx watch`)     |
| `npm run build`      | Type-checks and compiles the project into `dist/`                |
| `npm start`          | Runs the compiled production build (`dist/server.js`)            |
| `npm test`           | Runs the Vitest + Supertest smoke test suite                     |
| `npm run test:watch` | Runs tests in interactive watch mode                             |
| `npm run format`     | Formats source files in `./src` with Biome                       |
| `npm run lint`       | Lints source files in `./src` with Biome                         |
| `npm run check`      | Runs Biome formatting, linting, and import sorting with auto-fix |


## Checklist for New Projects

1. Update `APP_NAME` and `DATABASE_URL` in `.env`.
2. Update `prisma/schema.prisma` and run `npx prisma migrate dev`.
3. Remove or replace sample integrations (`src/integrations/open-weather/` and `src/modules/weather/`).
4. Add new feature modules under `src/modules/<feature>/` and register routes in `src/app.ts`.
5. Update `src/docs/openapi.yaml` and run `npm test` to verify baseline health and error routes.