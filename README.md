# p-d API

Backend API on NestJS + Fastify + TypeORM (PostgreSQL).

## Stack

- NestJS 11
- Fastify
- TypeORM
- PostgreSQL
- JWT auth
- Swagger (`/docs`)
- CASL (ability-based access rules)

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL

## Install

```bash
npm install
```

## Environment Variables

Create `.env` in the project root and define:

- `APP_ENV`
- `HOSTNAME`
- `PORT`
- `DB_TYPE`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DATABASE`
- `JWT_SECRET`

## Run

Development:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

Swagger:

- [http://HOSTNAME:PORT/docs](http://HOSTNAME:PORT/docs)

## Auth and Roles

### Login

- `POST /auth`
- Body:

```json
{
  "login": "admin",
  "password": "123"
}
```

Returns:

```json
{
  "accessToken": "..."
}
```

Mock users available now:

- `admin`
- `normal`
- `limited`

### Protected API

Use bearer token in `Authorization` header:

```text
Authorization: Bearer <token>
```

### Role Rules (CASL)

For `GET /locus`:

- `ADMIN`: can use all filters and sideloads
- `NORMAL`: read-only (no `sideload`, no `regionId`, no `membershipStatus`)
- `LIMITED`: can use filters/sideload, but region filtering is restricted to allowed region ids

## Main Endpoint

### `GET /locus`

Supports:

- filters: `id`, `assemblyId`, `regionId`, `membershipStatus`
- sorting: `sortBy`, `sortOrder`
- pagination: `offset`, `limit`
- sideload: `sideload=locusMembers`

## Tests

Run all tests:

```bash
npm test
```

Run once, serial mode:

```bash
npm test -- --runInBand
```

Coverage:

```bash
npm run test:cov
```

## Lint and Format

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
```
