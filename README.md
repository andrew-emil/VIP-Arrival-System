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

To access the swagger UI, navigate to `http://localhost:3000/api`.

---

## API Endpoints

### 1. Ingress (Report Plate Read)

Receives vehicle plate data from cameras. protected by an API Key.

- **URL:** `/ingress`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `x-api-key`: Your configured API Key (e.g., `secret-api-key`)
- **Body:**

| Field       | Type    | Required | Description                                  |
| :---------- | :------ | :------- | :------------------------------------------- |
| `plate`     | String  | Yes      | License plate number                         |
| `timestamp` | ISO8601 | No       | Time of capture (defaults to now if omitted) |
| `cameraId`  | String  | No       | ID of the camera source                      |
| `lat`       | Number  | No       | Latitude                                     |
| `lng`       | Number  | No       | Longitude                                    |

#### cURL Example

```bash
curl -X POST "http://localhost:3000/api/ingress" \
     -H "Content-Type: application/json" \
     -H "x-api-key: secret-api-key" \
     -d '{
           "plate": "ABC-123",
           "timestamp": "2023-10-27T10:00:00Z",
           "cameraId": "CAM-01",
           "lat": 30.0444,
           "lng": 31.2357
         }'
```

### 2. Feed (Get Arrivals)

Retrieves a feed of vehicle arrivals.

- **URL:** `/feed`
- **Method:** `GET`
- **Query Parameters:**

| Parameter | Type    | Description                                   |
| :-------- | :------ | :-------------------------------------------- |
| `since`   | String  | Date/Time string to filter results after      |
| `limit`   | Number  | Limit the number of results                   |
| `isVip`   | Boolean | Filter for VIP vehicles only (`true`/`false`) |

#### cURL Examples

```bash
# Get last 10 arrivals
curl -X GET "http://localhost:3000/api/feed?limit=10"

# Get only VIP arrivals
curl -X GET "http://localhost:3000/api/feed?isVip=true&limit=20"
```

### 3. Health Check

Checks the health of the application.

```bash
curl -X GET "http://localhost:3000/api/health"
```
