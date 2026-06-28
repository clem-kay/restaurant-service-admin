import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminPage from "@/pages/AdminPage.tsx";
import AuthPage from "@/pages/AuthPage.tsx";
import App from "../App.tsx";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";
import DashboardStatsPage from "@/pages/DashboardStatsPage.tsx";
import InventoryPage from "@/pages/InventoryPage.tsx";
import OrdersPage from "@/pages/OrdersPage.tsx";
import CustomersPage from "@/pages/CustomersPage.tsx";
import RidersPage from "@/pages/RidersPage.tsx";
import RestaurantsPage from "@/pages/RestaurantsPage.tsx";

const router = createBrowserRouter([
    { index: true, path: "auth/login", element: <AuthPage /> },
    {
        path: "/",
        element: <ProtectedRoute element={<App />} />,
    },
    {
        path: "admin",
        element: <ProtectedRoute element={<AdminPage />} />,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <DashboardStatsPage /> },
            { path: "inventory", element: <InventoryPage /> },
            { path: "orders", element: <OrdersPage /> },
            { path: "customers", element: <CustomersPage /> },
            { path: "riders", element: <RidersPage /> },
            { path: "restaurants", element: <RestaurantsPage /> },
        ],
    },
]);

export default router;
