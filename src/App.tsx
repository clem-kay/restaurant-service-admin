import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const App = () => {
    const currentPath = useLocation().pathname.replace('/', '');
    console.log(currentPath)
    const navigate = useNavigate();
    useEffect(() => {
        if (currentPath === '') {
            navigate('/admin/dashboard')
        }
    }, [currentPath, navigate]);
    return null;
};
export default App;