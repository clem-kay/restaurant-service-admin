import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/api-client.ts";
import {EndPoints, ROLE} from "@/constants/constants.ts";

export interface UserAccountResponse {
    username: string
    role: ROLE,
    createdAt: string;
    updatedAt: string;
}

const apiClient = new APIClient<UserAccountResponse[], null>(EndPoints.USERACCOUNT)

const UseUserAccounts = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: apiClient.getAll,
        staleTime: 0,
        retry: 2
    });
};

export default UseUserAccounts;