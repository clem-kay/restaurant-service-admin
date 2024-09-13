import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import useAuthStore from "@/store/useAuthStore.ts";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {handleError} from '@/utils/utils.ts';
import {EndPoints, ROLE} from "@/constants/constants.ts";

export interface RegisterUserAccountData {
    username: string;
    password: string;
    role: ROLE;
}

export interface RegisterUserAccountResponse {
    access_token: string;
    refresh_token: string;
    message: string;
    id: number;
    username: string;
    role: ROLE;
}

const apiClient = new APIClient<RegisterUserAccountData, RegisterUserAccountResponse>(EndPoints.USERACCOUNT);

const registerUserAccountFn = (registerData: RegisterUserAccountData) => {
    return apiClient.post(registerData);
};

const UseRegisterUserAccount = () => {
    const navigate = useNavigate();
    // const setUser = useAuthStore((store) => store.setUser);
    // const setToken = useAuthStore((store) => store.setToken);
    // const setRefreshToken = useAuthStore((store) => store.setRefreshToken);
    // const setIsLoggedIn = useAuthStore((store) => store.setIsLoggedIn);
    const isLoggedIn = useAuthStore((store) => store.isLoggedIn);
    const isRegisterUser = useAuthStore((store) => store.isRegisterUser);
    const setIsRegisterUser = useAuthStore((store) => store.setIsRegisterUser);
    const clearAuth = useAuthStore((store) => store.clearAuth);

    useEffect(() => {
        // if (isLoggedIn && !isRegisterUser) {
        //     navigate('/auth/login');
        // }
    }, [isLoggedIn, isRegisterUser, navigate]);


    return useMutation({
        mutationFn: registerUserAccountFn,
        mutationKey: ['register'],
        onSuccess: () => {
            clearAuth()
            setIsRegisterUser(false)
            toast.success("User Account Creation Successful");
            navigate('/auth/login');
        },
        onError: (error) => {
            handleError(error)
        },
    });
};

export default UseRegisterUserAccount;