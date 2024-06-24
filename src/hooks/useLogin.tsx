import {useMutation} from '@tanstack/react-query';
import APIClient from '../services/api-client';
import useAuthStore from "@/store/useAuthStore.ts";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";

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
            const {access_token, refresh_token, username, id} = data;
            toast.success("Login Successful");
            setUser({userId: id, username});
            setToken(access_token);
            setRefreshToken(refresh_token);
            setIsLoggedIn(true);
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    toast.error('Username or password incorrect');
                } else if (error.response?.status === 500) {
                    toast.error('Internal server error. Please try again later.');
                } else {
                    toast.error(`Error: ${error.response?.statusText || 'Unknown error'}`);
                }
            } else {
                toast.error('An unexpected error occurred');
            }
        },
    });
};

export default useLogin;
