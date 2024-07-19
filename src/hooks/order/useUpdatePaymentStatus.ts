import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import {EndPoints} from "@/constants/constants";
import useOrderStore from "@/store/useOrderStore";

export interface StatusData {
    status: boolean;
    userId: number;
}

export interface UpdatePaymentResponse {
    paid: boolean;
}

const apiClient = new APIClient<StatusData, UpdatePaymentResponse>(EndPoints.PAYMENT_STATUS);

const updatePaymentStatusFn = (orderId: number, statusData: StatusData) => {
    return apiClient.put(orderId, statusData);
};

const useUpdatePaymentStatus = () => {
    const updateOrder = useOrderStore(s => s.updateOrder);
    // const userAccountId = useOrderStore(s => s.userAccountId);

    return useMutation({
        mutationFn: ({orderId, statusData}: {
            orderId: number;
            statusData: StatusData
        }) => updatePaymentStatusFn(orderId, statusData),
        mutationKey: ['update-payment-status'],
        onSuccess: (data, variables) => {
            updateOrder(variables.orderId, {paid: data.paid});
        }
    });
};

export default useUpdatePaymentStatus;
