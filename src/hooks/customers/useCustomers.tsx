import { useQuery } from "@tanstack/react-query";
import APIClient from "@/services/api-client";
import { EndPoints } from "@/constants/constants";

export interface CustomerResponse {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    addresses: { id: number; label: string; address: string }[];
    account?: { username: string; profile?: { email?: string } };
}

const apiClient = new APIClient<CustomerResponse[], null>(EndPoints.CUSTOMERS);

const useCustomers = () => {
    return useQuery<CustomerResponse[]>({
        queryKey: ["customers"],
        queryFn: apiClient.getAll,
        staleTime: 0,
        retry: 2,
    });
};

export default useCustomers;
