# VIP Arrival System (VAS) – Phase 1

VIP Arrival System is a NestJS-based backend application designed to ingest vehicle plate reads, normalize and match them against a VIP list, and manage the end-to-end arrival lifecycle of VIP visitors.

Phase 1 is a **Lean PoC** focused on correctness, traceability, and clean architecture.

---

## 📋 Project Overview

The VIP Arrival System provides core capabilities for managing VIP arrivals using a multi-camera setup:

1. **Ingress API**: Accept plate read events from ALPR cameras/webhooks (Protected via API Key).
2. **Auth & User Management**: Session-based authentication and Role-Based Access Control (RBAC).
3. **VIP Management**: Create and manage VIP license plates for matching.
4. **Event Management**: Create and track specific events (e.g., summits, conferences) with active windows.
5. **Session Lifecycle (FSM)**: Automated state transitions from `REGISTERED` to `CONFIRMED` based on camera roles.
6. **Real-Time SSE**: Push-based updates for alerts, arrivals, and system health status.
7. **Job Queueing**: Async processing of plate reads using BullMQ and Redis for high-burst handling.
8. **Feed API**: Polling-based fallback feed for processed arrivals.

### Key Features

- **Automated State Machine**: Track VIP status: `REGISTERED` → `APPROACHING` (via Outer Cameras) → `ARRIVED` (via Gate Cameras).
- **Manual Confirmation**: UI-driven confirmation (`ARRIVED` → `CONFIRMED`) by gate personnel.
- **Enhanced RBAC**: Granular roles: `ADMIN`, `MANAGER`, `OPERATOR`, `OBSERVER`, and `GATE_GUARD`.
- **Device Accounts**: Specialized accounts for gate devices (phones/tablets) linked directly to physical cameras.
- **Camera Management**: Monitor camera health and assign roles (Entrance vs. Approach).
- **Plate normalization**: Trim + uppercase + remove spaces/dashes for robust matching.
- **Retroactive Matching**: Automatically match new VIP registrations against the last 60 minutes of unknown plate reads.
- **Polling feed**: Cursor-based pagination for live updates.
- **Full audit trail**: Traceability for all major system actions and state transitions.

---

## 🧱 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Session Store**: PostgreSQL (via `connect-pg-simple`)
- **Logging**: Pino / Nestjs-Pino
- **Async Queue**: BullMQ (Redis-backed)
- **Container**: Docker / Docker Compose (includes PostgreSQL and Redis)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory. See `.env.example` for a complete template.

| Variable | Description | Example | Required |
| ---------- | ------------- | --------- | ---------- |
| `NODE_ENV` | Application environment | `development` | Yes |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` | Yes |
| `SESSION_SECRET` | Secret key for session encryption | `your-secret-session-key` | Yes |
| `API_KEY` | Key for ALPR Ingress API | `your-secret-api-key` | Yes |
| `CAMERA_WEBHOOK_SECRET` | Token for validating webhooks | `your-webhook-secret` | No |
| `BCRYPT_ROUNDS` | Password hashing complexity | `12` | No |
| `REDIS_HOST` | Redis server host | `localhost` | Yes |
| `REDIS_PORT` | Redis server port | `6379` | Yes |
| `PORT` | Server port | `3000` | No |

---

## 🚀 How to Run

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Install dependencies & Generate Prisma Client

```bash
npm install
npx prisma generate
```

### 3. Run database migrations & Seed

```bash
npx prisma migrate deploy
npx prisma db seed
```

*Note: Seeding creates a default admin user and VIPs based on values in your `.env` file.*

### 4. Start the application

```bash
npm run start:dev
```

---

## 🧪 Testing

The project includes pre-configured `.http` files for testing all endpoints directly from your IDE (VS Code with REST Client extension or JetBrains HTTP Client).

You can find them in the `http/` directory:

- `auth.http`: Login, logout, and profile checks.
- `users.http`: User management and permissions.
- `events.http`: Event creation and status updates.
- `vip.http`: VIP registration and Listing + Manual Confirmation.
- `ingress.http`: Plate read ingestion (requires API Key).
- `feed.http`: Arrival feed polling.
- `realtime.http`: SSE ticket generation and streaming tests.
- `health.http`: System and Camera health checks.

---

## 📖 API Documentation (Swagger)

Interactive API documentation is available at: **[http://localhost:3000/docs](http://localhost:3000/docs)**

---

## 🔑 Authentication

The system uses two types of authentication:

### 1. Session Authentication (For Users/Admin)

All management endpoints (`/users`, `/vip`, `/feed`) require an active session.

1. **Login**: `POST /auth/login` with email/password.
2. **Cookie**: The server sets a `sid` cookie.
3. **Logout**: `POST /auth/logout`.

### 2. API Key Authentication (For Ingress)

Used for ALPR cameras to submit data to `POST /ingress/plate-reads`.

- Include the `x-api-key` header in your requests.

### 3. SSE Tickets

Real-time streaming requires a short-lived ticket:

1. **Generate**: `POST /realtime/ticket` (Requires session).
2. **Stream**: `GET /realtime/stream?ticket=<uuid>`.

---

## 📡 API Endpoints (Highlights)

### Auth

- `POST /auth/login`: Authenticate and start a session.
- `POST /auth/logout`: Destroy the current session.
- `GET /auth/me`: Get current user profile.

### Users (Admin Only)

- `GET /users`: List all users.
- `POST /users`: Create a new user.
- `PATCH /users/:id`: Update user details or status.
- `DELETE /users/:id`: Delete a user.

### Ingress

- `POST /ingress/plate-reads`: Receives plate data from cameras. (Locked via API Key)
- `POST /ingress/webhook`: Specialized endpoint for third-party ALPR webhooks.

### VIP & Feed

- `GET /vip`: List registered VIPs.
- `POST /vip`: Register a new VIP (includes retroactive matching).
- `PATCH /vip/sessions/:id/confirm`: Manually confirm a VIP arrival at the gate.
- `GET /feed`: Polling feed of arrivals and status transitions.

### Events

- `POST /events`: Create a new event with scheduling.
- `GET /events`: List all events.
- `GET /events/active`: Get currently active events.

### Camera & Real-Time

- `GET /camera/health`: Check status/latency of connected camera units.
- `POST /realtime/ticket`: Generate a 60s single-use ticket for SSE.
- `GET /realtime/stream`: SSE endpoint for live events (ALERT_CREATED, VIP_ARRIVED, etc.).
