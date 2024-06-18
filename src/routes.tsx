import {createBrowserRouter} from "react-router-dom";
import Layout from "./pages/Layout";
import AdminPage from "@/pages/AdminPage.tsx";
import ProtectedRoute from "@/components/Auth/ProtectedRoute.tsx";
import AuthPage from "@/pages/AuthPage.tsx";


const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthPage/>,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute element={<Layout/>}/>
        ),
        children: [
            {path: 'admin', element: <AdminPage/>},
        ],
    },
]);
export default router;