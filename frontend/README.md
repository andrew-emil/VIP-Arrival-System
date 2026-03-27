# VIP Arrival System - Frontend

The frontend interface for the VIP Arrival System. Built for speed, responsiveness, and real-time data handling.

## Tech Stack

- **Framework**: [React](https://react.dev/) 19 powered by [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) components
- **State Management & Data Fetching**: [Zustand](https://docs.pmnd.rs/zustand) & [@tanstack/react-query](https://tanstack.com/query/latest)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Internationalization**: [react-i18next](https://react.i18next.com/)

## Project Commands

In the project directory, you can run:

### `npm run dev`

Starts the Vite development server. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Runs ESLint to analyze the code and catch possible issues.

### `npm test`

Runs the test watcher using Vitest.

## Directory Structure

- `src/pages`: Major views for the application (e.g., Dashboard, Login, VIPs, Manage Users).
- `src/components`: Reusable UI components including Shadcn building blocks and specialized domain components.
- `src/loaders`: Route loaders to manage roles and pre-fetch critical layouts/data.

## Role-based Dashboard Access

The application relies heavily on session caching and predefined roles to route users correctly based on the `rootLoader` and `requireRole` handlers. Ensure your session state correctly reflects your assigned role (`admin`, `operator`, `manager`, `observer`, or `gate_guard`) to view route-specific dashboards.
