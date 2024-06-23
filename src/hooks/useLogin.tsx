import { useMutation } from '@tanstack/react-query';
import APIClient from '../services/api-client';
import useAuthStore from "@/store/useAuthStore.ts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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

const apiClient = new APIClient<LoginData>('/auth/login');

const loginReqFn = (loginData: LoginData) => {
    console.log("...Posting");
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
            navigate('/admin');
        } else {
            navigate('/auth/login');
        }
    }, [isLoggedIn, navigate]);

    return useMutation({
        mutationFn: loginReqFn,
        mutationKey: ['login'],
        onSuccess: (data: LoginResponse) => {
            const { access_token, refresh_token, username, id, message } = data;
            // Checks if response -> ( credentials )  is not empty
            if (!access_token || !username || !id) {
                console.log(data)
                toast.error(message || "Username or password incorrect");
            } else {
                toast.success("Login Successful");
                setUser({ userId: id, username });
                setToken(access_token);
                setRefreshToken(refresh_token);
                setIsLoggedIn(true);
            }
        },
        onError: () => {
            toast.error('Authentication failed!');
        },
    });
};

export default useLogin;
