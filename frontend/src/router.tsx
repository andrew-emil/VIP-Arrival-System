import { createBrowserRouter, Outlet } from "react-router";
import { requireRole } from "./loaders/role.loader";
import { rootLoader } from "./loaders/root.loader";
import AccountDevicePage from "./pages/AccountDevicePage";
import CamerasPage from "./pages/CamerasPage";
import EventsPage from "./pages/EventsPage";
import GatePage from "./pages/GatePage";
import LoginPage from "./pages/LoginPage";
import ManagerMonitor from "./pages/ManagerMonitor";
import NotFound from "./pages/NotFound";
import OperationsDashboard from "./pages/OperationsDashboard";
import SessionsPage from "./pages/SessionsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import VipsPage from "./pages/VipsPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        loader: rootLoader,
        element: <Outlet />,
    },
    {
        path: "/dashboard",
        loader: requireRole(['admin', 'operator']),
        element: <OperationsDashboard />,
    },
    {
        path: "/manager/monitor",
        loader: requireRole(['manager', 'observer']),
        element: <ManagerMonitor />,
    },
    {
        path: "/vips",
        loader: requireRole(['admin', 'operator']),
        element: <VipsPage />,
    },
    {
        path: "/events",
        loader: requireRole(['admin']),
        element: <EventsPage />,
    },
    {
        path: "/cameras",
        loader: requireRole(['admin']),
        element: <CamerasPage />,
    },
    {
        path: "/account-devices",
        loader: requireRole(['admin']),
        element: <AccountDevicePage />,
    },
    {
        path: "/users",
        loader: requireRole(['admin']),
        element: <UsersPage />,
    },
    {
        path: "/sessions",
        loader: requireRole(['admin', 'operator']),
        element: <SessionsPage />,
    },
    {
        path: "/gate",
        loader: requireRole(['gate_guard']),
        element: <GatePage />,
    },
    {
        path: "/settings",
        loader: requireRole(['admin', 'operator', 'manager', 'observer', 'gate_guard']),
        element: <SettingsPage />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);