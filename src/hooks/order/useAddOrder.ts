import APIClient from "@/services/api-client";
import { EndPoints } from "@/constants/constants";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useOrderStore from "@/store/useOrderStore";
import { OrderResponseMany } from "@/hooks/order/useOrders";
import { OrderResponse } from "@/hooks/order/useOrder.ts";

export interface CreateOrderData {
    order: {
        name: string;
        email: string;
        number: string;
        location: string;
        other_info: string;
        totalAmount: number;
        pickup_status: string;
        food_status: string;
    },
    orderItems: {
        foodMenuId: number;
        quantity: number;
        price: number;
    }[];
}

const createOrderApiClient = new APIClient<CreateOrderData, OrderResponse>(EndPoints.ORDER);

const createOrder = (orderData: CreateOrderData) => {
    return createOrderApiClient.post(orderData);
};

const useAddOrder = () => {
    const queryClient = useQueryClient();
    const setOrders = useOrderStore(s => s.setOrders);
    const orders = useOrderStore(s => s.orders);

    return useMutation({
        mutationFn: (orderData: CreateOrderData) => createOrder(orderData),
        mutationKey: ['create-order'],
        onSuccess: (newOrder) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setOrders([...orders,
                {
                    id: newOrder.id,
                    createdAt: newOrder.createdAt,
                    updatedAt: newOrder.updatedAt,
                    food_status: newOrder.food_status,
                    totalAmount: newOrder.totalAmount,
                    name: newOrder.name,
                    email: newOrder.email,
                    number: newOrder.number,
                    location: newOrder.location,
                    other_info: newOrder.other_info,
                    pickup_status: newOrder.pickup_status,
                    comment: newOrder.comment,
                    paid: newOrder.paid,
                    totalFoodItems: newOrder.orderItems.length,
                }
            ] as OrderResponseMany[]);
        },
        onError: (e, variables) => {
            console.log(e);
            console.log(variables);
        }
    });
};

export default useAddOrder;
