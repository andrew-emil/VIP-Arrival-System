# VIP Arrival System - Backend

The core API and business logic layer for the VIP Arrival System. Built with enterprise-grade tools to ensure reliability, type-safety, and performance.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Database ORM**: [Prisma](https://www.prisma.io/) v6 with [PostgreSQL](https://www.postgresql.org/)
- **Queue System**: [BullMQ](https://docs.bullmq.io/) (requires Redis)
- **Authentication**: Session-based auth & JWT integration
- **Caching**: `nestjs/cache-manager`
- **Logging**: `nestjs-pino`

## Getting Started

### Prerequisites

Ensure you have a PostgreSQL database and a Redis instance running locally or accessible remotely.

### Installation

```bash
npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Database & Prisma

To synchronize the database schema and generate the Prisma Client, use:

```bash
npx prisma generate
npx prisma db push
```

If you need to seed initial test data, run:

```bash
npx prisma db seed
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

When the application is running in development mode, the interactive Swagger API documentation can be accessed on the configured default swagger path (typically `/api` or `/docs`), provided the module is initialized correctly in `main.ts`.
