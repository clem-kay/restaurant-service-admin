import {createBrowserRouter} from "react-router-dom";
import AdminPage from "@/pages/AdminPage.tsx";
import AuthPage from "@/pages/AuthPage.tsx";
import App from "../App.tsx";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";
import InventoryContainer from "@/components/Dashboard/InventoryContainer.tsx";
import OrderView from "@/components/Dashboard/orders/OrderView.tsx";
import Overview from "@/components/Dashboard/overview/Overview.tsx";
import UserAccounts from "@/components/Dashboard/users/UserAccounts.tsx";
import UserView from "@/components/Dashboard/users/UserView.tsx";


const router = createBrowserRouter([
    {index: true, path: 'auth/login', element: <AuthPage/>},
    {path: 'auth/register', element: <AuthPage/>},
    {path: '/', element: <ProtectedRoute element={<App/>}/>,},
    {
        path: 'admin/dashboard',
        element: <ProtectedRoute element={<AdminPage/>}/>,
        children: [
            {path: 'categories', element: <InventoryContainer/>},
            {path: 'users', element: <UserView/>},
            {path: 'orders', element: <OrderView/>},
            {index: true, element: <Overview/>},
        ]

    }
]);
export default router;