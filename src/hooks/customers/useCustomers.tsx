import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api-client";
import { EndPoints } from "@/constants/constants";
import useAuthStore from "@/store/useAuthStore";

export interface CustomerResponse {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    addresses: { id: number; label: string; address: string }[];
    account?: { username: string; profile?: { email?: string } };
}

const useCustomers = () => {
    const role = useAuthStore((s) => s.user?.role);
    const isRestaurantRole = role === 'RESTAURANT_ADMIN' || role === 'RESTAURANT_STAFF';
    const endpoint = isRestaurantRole ? EndPoints.CUSTOMERS_MINE : EndPoints.CUSTOMERS;

    return useQuery<CustomerResponse[]>({
        queryKey: ["customers", role],
        queryFn: () => axiosInstance.get<CustomerResponse[]>(endpoint).then((r) => r.data),
        staleTime: 0,
        retry: 2,
    });
};

export default useCustomers;
