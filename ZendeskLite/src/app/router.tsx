import { createBrowserRouter, Navigate } from "react-router-dom";

import Dashboard from "../features/tickets/Dashboard.tsx";
import TicketDetails from "../features/tickets/TicketDetails";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/ticket/:ticketId",
        element: <TicketDetails />,
    }
]);