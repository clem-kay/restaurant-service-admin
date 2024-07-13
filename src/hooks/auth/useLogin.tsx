import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import useAuthStore from "@/store/useAuthStore.ts";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {handleError} from '@/utils/utils.ts';
import {EndPoints} from "@/constants/constants.ts";

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
}

const apiClient = new APIClient<LoginData, LoginResponse>(EndPoints.LOGIN);

const loginReqFn = (loginData: LoginData) => {
    return apiClient.post(loginData);
};

const useLogin = () => {
    const navigate = useNavigate();
    const setUser = useAuthStore((store) => store.setUser);
    const setToken = useAuthStore((store) => store.setToken);
    const setRefreshToken = useAuthStore((store) => store.setRefreshToken);
    const setIsLoggedIn = useAuthStore((store) => store.setIsLoggedIn);
    const isLoggedIn = useAuthStore((store) => store.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/admin/dashboard');
        } else {
            navigate('/auth/login');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {


    }, [])

    return useMutation({
        mutationFn: loginReqFn,
        mutationKey: ['login'],
        onSuccess: (data: LoginResponse) => {
            const {access_token, refresh_token, username, id} = data;
            toast.success("Login Successful");
            setUser({userId: id, username});
            setToken(access_token);
            setRefreshToken(refresh_token);
            setIsLoggedIn(true);
        },
        onError: (error) => {
            handleError(error)
        },
    });
};

export default useLogin;
