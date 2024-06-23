import {Navigate} from "react-router-dom";
import {ReactElement} from "react";
import useAuthStore from "@/store/useAuthStore.ts";

interface ProtectedRouteProps {
    element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({element}) => {
    const isLoggedIn = useAuthStore(store => store.isLoggedIn);
    const isAuthenticated = (): boolean => {
        // return localStorage.getItem('isAuthenticated') === 'true';
        //For now
        return isLoggedIn;
    };

    return isAuthenticated() ? element : <Navigate to="/auth/login"/>;
};


export default ProtectedRoute;