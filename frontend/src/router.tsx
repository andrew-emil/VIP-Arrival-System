import { createBrowserRouter } from "react-router";
import { requireRole } from "./loaders/role.loader";
import { rootLoader } from "./loaders/root.loader";
import AccountDevicePage from "./pages/AccountDevicePage";
import AdminDashboard from "./pages/AdminDashboard";
import EventsPage from "./pages/EventsPage";
import GatePage from "./pages/GatePage";
import LoginPage from "./pages/LoginPage";
import ManagerMonitor from "./pages/ManagerMonitor";
import NotFound from "./pages/NotFound";
import OperatorDashboard from "./pages/OperatorDashboard";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import VipsPage from "./pages/VipsPage";
import CamerasPage from "./pages/CamerasPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        loader: rootLoader,
    },
    {
        path: "/admin/dashboard",
        loader: requireRole(['admin']),
        element: <AdminDashboard />,
    },
    {
        path: "/operator/dashboard",
        loader: requireRole(['admin', 'operator']),
        element: <OperatorDashboard />,
    },
    {
        path: "/manager/monitor",
        loader: requireRole(['admin', 'manager']),
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
        loader: requireRole(['admin', 'operator']),
        element: <AccountDevicePage />,
    },
    {
        path: "/users",
        loader: requireRole(['admin']),
        element: <UsersPage />,
    },
    {
        path: "/gate",
        loader: requireRole(['admin', 'gate']),
        element: <GatePage />,
    },
    {
        path: "/settings",
        loader: requireRole(['admin', 'operator', 'manager', 'gate']),
        element: <SettingsPage />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);