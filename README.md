# VIP Arrival System (VAS) – Phase 1

VIP Arrival System is a NestJS-based backend application designed to ingest vehicle plate reads, normalize and match them against a VIP list, and expose a polling feed of arrivals.

Phase 1 is a **Lean PoC** focused on correctness, traceability, and clean architecture.  
No realtime, no AI logic, no external integrations.

---

## 📋 Project Overview

The VIP Arrival System provides three core capabilities:

1. **Ingress API**: Accept plate read events from ALPR cameras/webhooks
2. **Feed API**: Polling-based feed of processed plate reads
3. **VIP Management**: Create and manage VIP license plates for matching

### Key Features

- Webhook-compatible ingestion with flexible key mapping
- Plate normalization (trim + uppercase + remove spaces/dashes)
- Exact VIP matching (active VIPs only)
- Polling feed with cursor-based pagination
- Full audit trail (received/normalized/matched events)
- Request-scoped logging with unique requestId

---

## 🧱 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Container**: Docker / Docker Compose

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) v18 or later
- [Docker](https://www.docker.com/) & Docker Compose
- npm or pnpm (comes with Node.js)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Example | Required |
| ---------- | ------------- | --------- | ---------- |
| `NODE_ENV` | Application environment | `development` | Yes |
| `PORT` | Server port | `3000` | No (default: 3000) |
| `ALLOWED_ORIGINS` | Allowed origins for CORS | `http://localhost:3000,http://localhost:8080` | No |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/vas` | Yes |
| `API_KEY` | API authentication key | `your-secret-key-here` | Yes |
| `POSTGRES_USER` | PostgreSQL username (Docker) | `postgres` | Yes |
| `POSTGRES_PASSWORD` | PostgreSQL password (Docker) | `postgres` | Yes |
| `POSTGRES_DB` | PostgreSQL database name | `vas` | Yes |
| `POSTGRES_PORT` | PostgreSQL port | `5432` | Yes |

See `.env.example` for a complete template with all available options.

---

## 🚀 How to Run

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run database migrations

```bash
npx prisma migrate deploy
```

### 4. Seed the database

```bash
npx prisma db seed
```

This creates:

- 3 cameras (CAM-01, CAM-02, CAM-03)
- 10 VIP records
- 5 sample plate reads (2 VIP matches + 3 non-VIP)

### 5. Start the application

```bash
npm run start:dev
```

The server will start on `http://localhost:3000` (by default).

### 6. Verify it's running

```bash
curl http://localhost:3000/health
```

### To stop the database

```bash
docker-compose down
```

---

## 🌐 Ports

| Service | Port | Description |
| --------- | ------ | ------------- |
| API Server | `3000` | Main application (configurable via `PORT` env var) |
| PostgreSQL | `5432` | Database (Docker container) |
| Swagger UI | `3000/docs` | API documentation interface |

---

## 📖 Swagger Documentation

Interactive API documentation is available at:

**<http://localhost:3000/docs>**

The Swagger UI includes:

- All endpoint schemas
- Request/response examples
- Authentication requirements
- "Try it out" functionality

---

## 🔑 API Authentication

Most API endpoints are **protected** and require a valid API Key.

### How to authenticate

1. Set `API_KEY` in your `.env` file
2. Include the `x-api-key` header in your requests

**Example:**

```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/feed
```

### Public endpoints (no API key required)

- `GET /health` - Health check
- `GET /docs` - Swagger documentation

---

## 📡 API Endpoints

### 1. Health Check

Checks the health of the application and database connection.  
**🔓 Public Endpoint**

**`GET /health`**

```bash
curl -X GET "http://localhost:3000/health"
```

---

### 2. Ingress (Plate Reads)

Handle ALPR plate read events. Supports webhook key mapping.

**`POST /ingress/plate-reads`**

**🔒 Requires API Key**

**Request Body:**

```json
{
  "plate": "ABC 123",
  "cameraId": "CAM-01",
  "timestamp": "2023-10-01T12:00:00Z",
  "confidence": 99.5,
  "snapshotUrl": "https://example.com/image.jpg"
}
```

**Webhook Key Mapping:**

- `plate` ← `plate` OR `plate_text`
- `timestamp` ← `timestamp` OR `readAt` OR `captured_at`
- `cameraId` ← `cameraId` OR `camera_id`
- `confidence` ← `confidence` OR `score`
- `snapshotUrl` ← `snapshotUrl` OR `image_url`

**Example:**

```bash
curl -X POST "http://localhost:3000/ingress/plate-reads" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "plate": "ABC 123",
    "cameraId": "CAM-01",
    "timestamp": "2024-02-09T10:00:00Z",
    "confidence": 98.5
  }'
```

**Response (201):**

```json
{
  "id": "uuid",
  "plateRaw": "ABC 123",
  "plateNormalized": "ABC123",
  "cameraId": "CAM-01",
  "receivedAt": "2024-02-09T10:05:23.123Z",
  "isVip": true,
  "matchType": "exact"
}
```

**Error Cases:**

- `400` - Missing `plate` or `cameraId`
- `400` - Invalid `timestamp` format
- `404` - Camera not found (strict mode)

---

### 3. Feed

Get a polling feed of processed plate reads (matched against VIPs).

**`GET /feed`**

**🔒 Requires API Key**

**Query Parameters:**

- `since` (optional): ISO date string to fetch records after (exclusive filter)
- `limit` (optional): Number of records to return (default: 50, max: 200)
- `isVip` (optional): Filter only VIP reads (`true`/`false`)

**Example:**

```bash
curl -X GET "http://localhost:3000/feed?limit=10&isVip=true" \
  -H "x-api-key: YOUR_API_KEY"
```

**Response:**

```json
{
  "items": [
    {
      "id": "uuid",
      "plate": "ABC123",
      "timestamp": "2024-02-09T10:00:00Z",
      "cameraId": "CAM-01",
      "isVip": true,
      "confidence": 98.5,
      "receivedAt": "2024-02-09T10:05:23.123Z"
    }
  ],
  "nextSince": "2024-02-09T10:05:23.123Z"
}
```

**Notes:**

- Results ordered by `receivedAt DESC` (newest first)
- `since` parameter uses **exclusive** filtering (`>`)
- `nextSince` cursor = last item's `receivedAt`
- Limits silently capped at 200 (no error)

---

### 4. VIP Management

#### Create VIP

Create a new VIP record.

**`POST /vip`**

**🔒 Requires API Key**

**Request Body:**

```json
{
  "plate": "ABC 123",
  "name": "VIP Name"
}
```

**Example:**

```bash
curl -X POST "http://localhost:3000/vip" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"plate": "VIP001", "name": "Important Person"}'
```

**Error Cases:**

- `409` - VIP with this plate already exists

---

#### List VIPs

List all VIPs or filter by plate.

**`GET /vip`**

**🔒 Requires API Key**

**Query Parameters:**

- `plate` (optional): Filter by plate number (partial match)

**Example:**

```bash
curl -X GET "http://localhost:3000/vip?plate=ABC" \
  -H "x-api-key: YOUR_API_KEY"
```

**Response:**

```json
{
  "items": [
    {
      "id": "uuid",
      "plateNormalized": "ABC123",
      "name": "VIP Name",
      "active": true
    }
  ]
}
```

---

## 🚫 Explicitly Out of Scope (Phase 1)

The following features are **intentionally excluded** from Phase 1 and may be considered for future releases:

- ❌ **Multi-tenancy**: No organization/tenant isolation
- ❌ **Authentication & Authorization**: No role-based access control (RBAC)
- ❌ **Advanced Audit Trail**: Basic audit events only (received/normalized/matched)
- ❌ **SaaS Billing**: No subscription or payment integration
- ❌ **Realtime Updates**: Polling-only (no WebSockets/SSE)
- ❌ **Rate Limiting**: No per-tenant or per-user throttling
- ❌ **External Integrations**: No third-party services (analytics, notifications, etc.)
- ❌ **AI/ML Processing**: No machine learning for plate recognition
- ❌ **Camera Auto-Registration**: Cameras must be pre-registered in database
- ❌ **Duplicate Detection**: Every POST creates a new PlateRead record

Phase 1 focuses on **core functionality**: Ingress → Normalization → VIP Matching → Feed API.

---

## 🗄️ Database Schema

### Models

1. **PlateRead**
   - Stores all incoming plate reads
   - Includes: plateRaw, plateNormalized, timestamps, VIP match result
   - Indexes: plateNormalized, cameraId, receivedAt

2. **VIP**
   - Unique plateNormalized
   - Optional name
   - Active flag (only active VIPs matched)

3. **Camera**
   - Pre-registered cameras
   - Custom IDs (e.g., CAM-01)

4. **AuditLog**
   - Events: received, normalized, matched
   - Links to PlateRead

See `prisma/schema.prisma` for full details.

---

## 📝 Error Handling

All errors return a consistent JSON format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "requestId": "uuid",
  "details": [
    { "field": "cameraId", "issue": "missing" }
  ]
}
```

### HTTP Status Codes

- `400` - Validation errors
- `401` - Missing/invalid API key
- `404` - Resource not found (e.g., camera)
- `409` - Conflict (e.g., duplicate VIP)
- `500` - Internal server error (stack trace hidden from client)

Every response includes a unique `requestId` for debugging.

---

## 🧪 Testing the System

After seeding, you can test the complete flow:

### 1. Check VIPs

```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/vip
```

### 2. Submit a VIP plate read

```bash
curl -X POST http://localhost:3000/ingress/plate-reads \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "plate": "ABC 123",
    "cameraId": "CAM-01"
  }'
```

### 3. Check the feed

```bash
curl -H "x-api-key: YOUR_API_KEY" "http://localhost:3000/feed?isVip=true"
```

You should see the VIP match with `"isVip": true`.

---

## 🐳 Docker Details

### Services

- **postgres**: PostgreSQL 15 database
  - Port: 5432
  - Volume: `postgres_data` (persisted)

### Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 📚 Additional Resources

- **Swagger UI**: <http://localhost:3000/docs>
- **Prisma Schema**: `prisma/schema.prisma`
- **Seed Data**: `prisma/seed.ts`
- **Environment Template**: `.env.example`

---

## ✅ Phase 1 - Definition of Done

Phase 1 is considered **complete** when:

- ✅ Repository is runnable from a fresh clone
- ✅ All specifications match requirements
- ✅ Documentation is clear and complete
- ✅ No scope creep beyond agreed features
- ✅ Ready for any Phase 2 team to continue

**Status:** Phase 1 Complete 🎉

---

## 📄 License

[Your License Here]

---

## 👥 Contributors

[Your Team Here]
