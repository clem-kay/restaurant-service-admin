import APIClient from "@/services/api-client.ts";
import {EndPoints} from "@/constants/constants";
import {useQuery} from "@tanstack/react-query";

const orderApiClient = new APIClient<OrderResponseMany[], null>(EndPoints.ORDER);


export interface OrderResponseMany {
    id: number;
    createdAt: string;
    updatedAt: string;
    food_status: string;
    totalAmount: number;
    name: string;
    email: string;
    number: string;
    location: string;
    other_info: string;
    pickup_status: string;
    comment: string | null;
    paid: boolean;
    totalFoodItems: number;
}

const useOrders = () => {
    return useQuery<OrderResponseMany[]>({
        queryKey: ['orders'],
        queryFn: orderApiClient.getAll,
        staleTime: 0,
        retry: 2
    });
};


export default useOrders;
