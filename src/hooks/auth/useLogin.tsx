import { useMutation } from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import useAuthStore from "@/store/useAuthStore.ts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { handleError } from '@/utils/utils.ts';
import { EndPoints, ROLE } from "@/constants/constants.ts";

interface LoginData {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    message: string;
    id: number;
    username: string;
    role: string;
}

const apiClient = new APIClient<LoginData, LoginResponse>(EndPoints.LOGIN);

const useLogin = () => {
    const navigate = useNavigate();
    const setUser = useAuthStore((store) => store.setUser);
    const setToken = useAuthStore((store) => store.setToken);
    const setRefreshToken = useAuthStore((store) => store.setRefreshToken);
    const setIsLoggedIn = useAuthStore((store) => store.setIsLoggedIn);

    return useMutation({
        mutationFn: (loginData: LoginData) => apiClient.post(loginData),
        mutationKey: ['login'],
        onSuccess: (data: LoginResponse) => {
            const { access_token, refresh_token, username, id, role } = data;
            setToken(access_token);
            setRefreshToken(refresh_token);
            setUser({ userId: id, username, role: role as ROLE });
            setIsLoggedIn(true);
            toast.success("Login Successful");
            navigate('/admin/dashboard');
        },
        onError: (error) => {
            handleError(error);
        },
    });
};

export default useLogin;
