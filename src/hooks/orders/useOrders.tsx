import { useQuery } from "@tanstack/react-query";
import APIClient from "@/services/api-client";
import { EndPoints } from "@/constants/constants";

export interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    foodMenuId: number;
}

export interface OrderResponse {
    id: number;
    createdAt: string;
    totalAmount: number;
    deliveryFee: number;
    foodStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    note?: string;
    restaurant?: { name: string };
    customer?: { firstName: string; lastName: string };
    orderItems: OrderItem[];
}

export interface OrdersPageResponse {
    data: OrderResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface OrderFilters {
    page?: number;
    limit?: number;
    foodStatus?: string;
    paymentStatus?: string;
    paymentMethod?: string;
}

const apiClient = new APIClient<OrdersPageResponse, null>(EndPoints.ORDER);

const useOrders = (filters: OrderFilters = {}) => {
    return useQuery<OrdersPageResponse>({
        queryKey: ["orders", filters],
        queryFn: () =>
            apiClient.getAll({
                params: {
                    page: filters.page ?? 1,
                    limit: filters.limit ?? 20,
                    ...(filters.foodStatus && { foodStatus: filters.foodStatus }),
                    ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
                    ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
                },
            }),
        staleTime: 0,
        retry: 2,
    });
};

export default useOrders;
