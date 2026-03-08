# VIP Arrival System (VAS) – Phase 1

VIP Arrival System is a NestJS-based backend application designed to ingest vehicle plate reads, normalize and match them against a VIP list, and expose a polling feed of arrivals.

Phase 1 is a **Lean PoC** focused on correctness, traceability, and clean architecture.

---

## 📋 Project Overview

The VIP Arrival System provides core capabilities for managing VIP arrivals:

1. **Ingress API**: Accept plate read events from ALPR cameras/webhooks (Protected via API Key).
2. **Auth & User Management**: Session-based authentication and Role-Based Access Control (RBAC).
3. **VIP Management**: Create and manage VIP license plates for matching.
4. **Feed API**: Polling-based feed of processed plate reads matched against VIPs.

### Key Features

- **Session-based Authentication**: Secure session management using PostgreSQL as a store.
- **RBAC**: Role-based access (ADMIN, MANAGER, OPERATOR) for different endpoints.
- **Webhook-compatible ingestion**: Flexible key mapping for ALPR data.
- **Plate normalization**: Trim + uppercase + remove spaces/dashes.
- **Exact VIP matching**: Active VIPs only.
- **Polling feed**: Cursor-based pagination for live updates.
- **Full audit trail**: Traceability for all major system actions.

---

## 🧱 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Session Store**: PostgreSQL (via `connect-pg-simple`)
- **Container**: Docker / Docker Compose

---

## 🔐 Environment Variables

Create a `.env` file in the root directory. See `.env.example` for a complete template.

| Variable | Description | Example | Required |
| ---------- | ------------- | --------- | ---------- |
| `NODE_ENV` | Application environment | `development` | Yes |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` | Yes |
| `SESSION_SECRET` | Secret key for session encryption | `your-secret-session-key` | Yes |
| `API_KEY` | Key for ALPR Ingress API | `your-secret-api-key` | Yes |
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
- `POST /users/:id/permissions`: Assign extra granular permissions.

### Ingress

- `POST /ingress/plate-reads`: Receives plate data from cameras. (Locked via API Key)

### VIP & Feed

- `GET /vip`: List registered VIPs.
- `POST /vip`: Register a new VIP.
- `GET /feed`: Polling feed of arrivals.

---

## 🚫 Explicitly Out of Scope (Phase 1)

Phase 1 focuses on core functionality. The following are excluded for now:

- ❌ **Multi-tenancy**: No organization isolation.
- ❌ **SaaS Billing**: No payment integration.
- ❌ **Realtime Updates**: Polling-only (no WebSockets).
- ❌ **AI/ML Processing**: No machine learning for OCR (external cameras only).

---

## ✅ Phase 1 - Status

**Status:** Phase 1 Core Complete 🎉

- ✅ Session-based Auth & RBAC Implemented.
- ✅ Users Management Service Completed.
- ✅ Ingress → Normalization → VIP Matching Flow Working.
- ✅ Audit Trail & Logging Built-in.
