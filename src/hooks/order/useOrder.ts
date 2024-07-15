import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/api-client";
import {EndPoints} from "@/constants/constants";

export interface OrderResponse {
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
    orderItems: {
        id: number;
        quantity: number;
        price: number;
        foodMenuId: number;
        orderId: number;
        foodMenu: {
            id: number;
            createdAt: string;
            updatedAt: string;
            name: string;
            price: number;
            imageUrl: string | null;
            description: string;
            userAccountId: number;
            categoryId: number;
        }
    }[];
}

const orderApiClient = new APIClient<OrderResponse, null>(EndPoints.ORDER);

const useOrder = (orderId?: number ) => {
    return useQuery<OrderResponse>({
        queryKey: ['order', orderId],
        queryFn: () => orderApiClient.get(orderId),
        staleTime: 0,
        retry: 2
    });
};

export default useOrder;
