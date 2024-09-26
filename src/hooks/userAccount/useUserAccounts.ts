import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/api-client.ts";
import {EndPoints, QueryKeys, ROLE} from "@/constants/constants.ts";

export interface UserAccountResponse {
    id: number;
    username: string;
    role: ROLE;
    isActive: boolean;
    createdAt: string;
}

const apiClient = new APIClient<UserAccountResponse[], null>(EndPoints.USER_ACCOUNTS)

const UseUserAccounts = () => {
    return useQuery<UserAccountResponse[]>({
        queryKey: [QueryKeys.USER_ACCOUNTS],
        queryFn: apiClient.getAll,
        staleTime: 0,
        retry: 2
    });
};

export default UseUserAccounts;