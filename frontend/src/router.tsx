import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router";
import { PageLoader } from "./components/PageLoader";
import { requireRole } from "./loaders/role.loader";
import { rootLoader } from "./loaders/root.loader";

const AccountDevicePage = lazy(() => import("./pages/AccountDevicePage"));
const CamerasPage = lazy(() => import("./pages/CamerasPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const GatePage = lazy(() => import("./pages/GatePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ManagerMonitor = lazy(() => import("./pages/ManagerMonitor"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OperationsDashboard = lazy(() => import("./pages/OperationsDashboard"));
const SessionsPage = lazy(() => import("./pages/SessionsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const VipsPage = lazy(() => import("./pages/VipsPage"));


export const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <Suspense fallback={<PageLoader />}>
                <LoginPage />
            </Suspense>
        ),
    },
    {
        path: "/",
        loader: rootLoader,
        element: (
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        ),
        children: [
            {
                path: "dashboard",
                loader: requireRole(['admin', 'operator']),
                element: <OperationsDashboard />,
            },
            {
                path: "manager/monitor",
                loader: requireRole(['manager', 'observer']),
                element: <ManagerMonitor />,
            },
            {
                path: "vips",
                loader: requireRole(['admin', 'operator']),
                element: <VipsPage />,
            },
            {
                path: "events",
                loader: requireRole(['admin']),
                element: <EventsPage />,
            },
            {
                path: "cameras",
                loader: requireRole(['admin']),
                element: <CamerasPage />,
            },
            {
                path: "account-devices",
                loader: requireRole(['admin']),
                element: <AccountDevicePage />,
            },
            {
                path: "users",
                loader: requireRole(['admin']),
                element: <UsersPage />,
            },
            {
                path: "sessions",
                loader: requireRole(['admin', 'operator']),
                element: <SessionsPage />,
            },
            {
                path: "gate",
                loader: requireRole(['gate_guard']),
                element: <GatePage />,
            },
            {
                path: "settings",
                loader: requireRole(['admin', 'operator', 'manager', 'observer', 'gate_guard']),
                element: <SettingsPage />,
            },
        ],
    },
    {
        path: "*",
        element: (
            <Suspense fallback={<PageLoader />}>
                <NotFound />
            </Suspense>
        ),
    },
]);