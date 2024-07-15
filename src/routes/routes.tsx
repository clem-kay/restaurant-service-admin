import {createBrowserRouter} from "react-router-dom";
import AdminPage from "@/pages/AdminPage.tsx";
import AuthPage from "@/pages/AuthPage.tsx";
import App from "../App.tsx";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";
import InventoryContainer from "@/components/Dashboard/InventoryContainer.tsx";
import OrderView from "@/components/Dashboard/orders/OrderView.tsx";


const router = createBrowserRouter([
    {index: true, path: 'auth/login', element: <AuthPage/>},
    {path: '/', element: <ProtectedRoute element={<App/>}/>,},
    {
        path: 'admin/dashboard',
        element: <ProtectedRoute element={<AdminPage/>}/>,
        children: [
            {path: 'categories', element: <InventoryContainer/>},
            {path: 'orders', element: <OrderView/>}
        ]

    }
]);
export default router;