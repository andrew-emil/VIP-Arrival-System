import { createBrowserRouter } from "react-router";
import { loginAction } from "./actions/login.action";
import { requireRole } from "./loaders/role.loader";
import { rootLoader } from "./loaders/root.loader";
import AdminPage from "./pages/AdminPage";
import DevicesPage from "./pages/DevicesPage";
import GatePage from "./pages/GatePage";
import { Login } from "./pages/Login";
import MonitorPage from "./pages/MonitorPage";
import OpsPage from "./pages/OpsPage";
import SessionsPage from "./pages/SessionsPage";
import VipsPage from "./pages/VipsPage";
import NotFound from "./pages/NotFound";
import { Role } from "./types/auth";
import { Layout } from "./components/Layout";

const router = createBrowserRouter([
  { path: '/', loader: rootLoader },
  { path: '/login', element: <Login />, action: loginAction },

  // Protected routes wrapped in Layout
  {
    element: <Layout />,
    children: [
      {
        path: '/admin',
        element: <AdminPage />,
        loader: requireRole([Role.ADMIN]),
      },
      {
        path: '/dashboard',
        element: <OpsPage />,
        loader: requireRole([Role.MANAGER, Role.OPERATOR]),
      },
      {
        path: '/monitor',
        element: <MonitorPage />,
        loader: requireRole([Role.MANAGER, Role.OBSERVER]),
      },
      {
        path: '/gate',
        element: <GatePage />,
        loader: requireRole([Role.GATE_GUARD]),
      },
      {
        path: '/sessions',
        element: <SessionsPage />,
        loader: requireRole([Role.ADMIN, Role.MANAGER, Role.OPERATOR])
      },
      {
        path: '/vips',
        element: <VipsPage />,
        loader: requireRole([Role.ADMIN, Role.MANAGER, Role.OPERATOR])
      },
      {
        path: '/devices',
        element: <DevicesPage />,
        loader: requireRole([Role.ADMIN])
      },
    ]
  },

  { path: '*', element: <NotFound /> },
]);

export default router;