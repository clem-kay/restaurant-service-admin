import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/api-client.ts";
import {EndPoints, ROLE} from "@/constants/constants.ts";

export interface UserAccountResponse {
    username: string
    role: ROLE,
    isActive: true
}

const apiClient = new APIClient<UserAccountResponse[], null>(EndPoints.USER_ACCOUNT)

const UseUserAccounts = () => {
    return useQuery<UserAccountResponse[]>({
        queryKey: ['user'],
        queryFn: apiClient.getAll,
        staleTime: 0,
        retry: 2
    });
};

export default UseUserAccounts;