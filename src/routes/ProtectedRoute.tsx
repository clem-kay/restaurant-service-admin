import {Navigate} from "react-router-dom";
import {ReactElement} from "react";

interface ProtectedRouteProps {
    element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({element}) => {
    const isAuthenticated = (): boolean => {
        return localStorage.getItem('isAuthenticated') === 'true';
    };

    return isAuthenticated() ? element : <Navigate to="/auth"/>;
};


export default ProtectedRoute;