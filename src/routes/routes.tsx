import {createBrowserRouter} from "react-router-dom";
import AdminPage from "@/pages/AdminPage.tsx";
import AuthPage from "@/pages/AuthPage.tsx";
import App from "../App.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {path: 'auth', index: true, element: <AuthPage/>},
            {path: 'admin', element: <AdminPage/>},
        ],
    },
]);
export default router;