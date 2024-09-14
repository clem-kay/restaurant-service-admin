import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import useAuthStore from "@/store/useAuthStore.ts";
import toast from "react-hot-toast";
import {handleError} from '@/utils/utils.ts';
import {EndPoints, ROLE} from "@/constants/constants.ts";

export interface RegisterUserAccountData {
    username: string;
    password: string;
    role: ROLE;
}

export interface RegisterUserAccountResponse {
    id: number;
    username: string;
    role: ROLE;
}

const apiClient = new APIClient<RegisterUserAccountData, RegisterUserAccountResponse>(EndPoints.USER_ACCOUNT);

const registerUserAccountFn = (registerData: RegisterUserAccountData) => {
    return apiClient.post(registerData);
};

const UseRegisterUserAccount = () => {
    const setIsRegisterUser = useAuthStore((store) => store.setIsRegisterUser);


    return useMutation({
        mutationFn: registerUserAccountFn,
        mutationKey: ['register'],
        onSuccess: () => {
            setIsRegisterUser(false)
            toast.success("User Account Creation Successful");
        },
        onError: (error) => {
            handleError(error)
        },
    });
};

export default UseRegisterUserAccount;