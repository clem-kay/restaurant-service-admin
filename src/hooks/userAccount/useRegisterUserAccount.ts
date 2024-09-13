import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import useAuthStore from "@/store/useAuthStore.ts";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {handleError} from '@/utils/utils.ts';
import {EndPoints} from "@/constants/constants.ts";

export interface RegisterUserAccountData {
    username: string;
    password: string;
}

export interface RegisterUserAccountResponse {
    access_token: string;
    refresh_token: string;
    message: string;
    id: number;
    username: string;
    role: string;
}

const apiClient = new APIClient<RegisterUserAccountData, RegisterUserAccountResponse>(EndPoints.USERACCOUNT);

const registerUserAccountFn = (loginData: RegisterUserAccountData) => {
    return apiClient.post(loginData);
};

const UseRegisterUserAccount = () => {
    const navigate = useNavigate();
    const setUser = useAuthStore((store) => store.setUser);
    const setToken = useAuthStore((store) => store.setToken);
    const setRefreshToken = useAuthStore((store) => store.setRefreshToken);
    const setIsLoggedIn = useAuthStore((store) => store.setIsLoggedIn);
    const isLoggedIn = useAuthStore((store) => store.isLoggedIn);
    const isRegisterUser = useAuthStore((store) => store.isRegisterUser);
    const clearAuth = useAuthStore((store) => store.clearAuth);

    useEffect(() => {
        if (isLoggedIn && !isRegisterUser) {
            navigate('/admin/dashboard');
        }
    }, [isLoggedIn, isRegisterUser, navigate]);


    return useMutation({
        mutationFn: registerUserAccountFn,
        mutationKey: ['register'],
        onSuccess: (data: RegisterUserAccountResponse) => {
            clearAuth()

            const {access_token, refresh_token, username, id, role} = data;
            toast.success("User Account Creation Successful");
            setUser({userId: id, username, role});
            setToken(access_token);
            setRefreshToken(refresh_token);
            setIsLoggedIn(true);
        },
        onError: (error) => {
            handleError(error)
        },
    });
};

export default UseRegisterUserAccount;