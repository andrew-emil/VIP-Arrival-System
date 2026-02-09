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

Run `docker compose up -d --build` to start the database.

Then run `npx prisma generate` to generate Prisma Client.

Run `npx prisma migrate dev --name init` to create the database schema.

Run `npx prisma db seed` to seed the database with initial data.

Run `npm run start:dev` to start the application.

The server will start on `http://localhost:3000` (by default).

To stop the database, run `docker compose down`.

---

## Authentication

Most API endpoints are protected and require a valid API Key.
Include the `x-api-key` header in your requests. Make sure `API_KEY` is set in your environment or `.env` file.

## Swagger

Swagger UI is available at:

<http://localhost:3000/docs>

## API Endpoints

### 1. Health Check

Checks the health of the application and database connection.
**Public Endpoint**

**GET** `/health`

```bash
curl -X GET "http://localhost:3000/health"
```

### 2. Ingress (Plate Reads)

Handle ALPR plate read events.

**POST** `/ingress/plate-reads`

**Body:**

```json
{
  "plate": "ABC 123",
  "cameraId": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2023-10-01T12:00:00Z",
  "confidence": 99.5,
  "snapshotUrl": "https://example.com/image.jpg"
}
```

```bash
curl -X POST "http://localhost:3000/ingress/plate-reads" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"plate": "ABC1234", "cameraId": "uuid-camera-id"}'
```

### 3. Feed

Get a live feed of processed plate reads (matched against VIPs).

**GET** `/feed`

**Query Parameters:**

- `since` (optional): ISO date string to fetch records after.
- `limit` (optional): Number of records to return (default: 50).
- `isVip` (optional): Filter only VIP reads (`true`/`false`).

```bash
curl -X GET "http://localhost:3000/feed?limit=10&isVip=true" \
  -H "x-api-key: YOUR_API_KEY"
```

In .env.example:
  API_KEY=CHANGE_ME

### 4. VIP Management

#### Create VIP

Create a new VIP record.

**POST** `/vip`

**Body:**

```json
{
  "plate": "ABC 123",
  "name": "VIP Name"
}
```

```bash
curl -X POST "http://localhost:3000/vip" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"plate": "VIP001", "name": "Important Person"}'
```

#### List VIPs

List all VIPs or filter by plate.

**GET** `/vip`

**Query Parameters:**

- `plate` (optional): Filter by plate number.

```bash
curl -X GET "http://localhost:3000/vip" \
  -H "x-api-key: YOUR_API_KEY"
```
