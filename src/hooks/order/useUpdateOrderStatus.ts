import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import {EndPoints} from "@/constants/constants";
import useOrderStore from "@/store/useOrderStore";

export interface StatusData {
    status: string;
    userId: number;
}

export interface UpdateOrderResponse {
    food_status: string;
}

const apiClient = new APIClient<StatusData, UpdateOrderResponse>(EndPoints.ORDER_STATUS);

const updateOrderStatusFn = (orderId: number, statusData: StatusData) => {
    return apiClient.put(orderId, statusData);
};

const useUpdateOrderStatus = () => {
    const updateOrder = useOrderStore(s => s.updateOrder);

    return useMutation({
        mutationFn: ({orderId, statusData}: {
            orderId: number;
            statusData: StatusData
        }) => updateOrderStatusFn(orderId, statusData),
        mutationKey: ['update-order-status'],
        onSuccess: (data, variables) => {
            updateOrder(variables.orderId, {food_status: data.food_status});
        }
    });
};

export default useUpdateOrderStatus;
