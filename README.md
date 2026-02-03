# VIP Arrival System (VAS) – Phase 1

VIP Arrival System is a NestJS-based backend application designed to ingest vehicle plate reads, normalize and match them against a VIP list, and expose a polling feed of arrivals.

Phase 1 is a **Lean PoC** focused on correctness, traceability, and clean architecture.
No realtime, no AI logic, no external integrations.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Docker](https://www.docker.com/) & Docker Compose

---

## 🧱 Tech Stack

- Node.js (v18+)
- NestJS
- Prisma ORM
- PostgreSQL (Docker Compose)

---

## Running the Application

Run first `npx prisma generate` to generate Prisma Client.

Then run `docker-compose up -d --build` to start the application.

The server will start on `http://localhost:3000` (by default).

To stop the application, run `docker-compose down`.

---

## Swagger

Swagger UI is available at:

<http://localhost:3000/api>

## API Endpoints

### Health Check

Checks the health of the application.

```bash
curl -X GET "http://localhost:3000/api/health"
```
