import {createBrowserRouter} from "react-router-dom";
import AdminPage from "@/pages/AdminPage.tsx";
import AuthPage from "@/pages/AuthPage.tsx";
import App from "../App.tsx";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";


const router = createBrowserRouter([
    {index: true, path: 'auth/login', element: <AuthPage/>},
    {
        path: '/',
        element: <ProtectedRoute element={<App/>}/>,
        children: [
            {path: 'admin/dashboard', element: <ProtectedRoute element={<AdminPage/>}/>},
        ],
    },
]);
export default router;