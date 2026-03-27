# VIP Arrival System

A comprehensive system designed to manage and monitor VIP arrivals, featuring real-time operations dashboards, user management, and gate control.

## Project Structure

This repository is structured as a monorepo containing both the frontend and backend applications:

- **[`/frontend`](./frontend/)**: React application built with Vite, utilizing Tailwind CSS, Shadcn UI, and React Query for state management.
- **[`/backend`](./backend/)**: Node.js backend powered by NestJS, utilizing Prisma ORM with PostgreSQL, and BullMQ for background jobs.

## Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL
- Redis (required for BullMQ queue management in the backend)

## Getting Started

### Backend Setup

1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure your environmental variables (e.g., PostgreSQL connection string, Redis URL).
4. Run Prisma migrations: `npx prisma db push` or `npx prisma migrate dev`
5. Start the backend development server: `npm run start:dev`

For more details, see the [Backend README](./backend/README.md).

### Frontend Setup

1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the frontend development server: `npm run dev`

For more details, see the [Frontend README](./frontend/README.md).

## Features

- **Role-based Access Control**: Different views and permissions for roles including `admin`, `operator`, `manager`, `observer`, and `gate_guard`.
- **Real-time Monitoring**: Operator dashboards, manager monitors, and live event tracking.
- **Entity Management**: Interface for managing VIP profiles, users, cameras, and linked account devices.
- **Gate Operations**: Specialized interfaces for gate guards to manage VIP arrivals.
- **Internationalization (i18n)**: Built-in support for translations and automatic language detection.
