import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api-client";
import { EndPoints } from "@/constants/constants";
import useAuthStore from "@/store/useAuthStore";
import useRestaurantStore from "@/store/useRestaurantStore";
import toast from "react-hot-toast";

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
    walkInName?: string;
    walkInPhone?: string;
    restaurant?: { id: number; name: string };
    customer?: { firstName: string; lastName: string; phone?: string };
    orderItems?: OrderItem[];
}

export interface OrdersPageResponse {
    data: OrderResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface OrderFilters {
    page?: number;
    limit?: number;
    foodStatus?: string;
    paymentStatus?: string;
    paymentMethod?: string;
}

const useOrders = (filters: OrderFilters = {}) => {
    const role = useAuthStore((s) => s.user?.role);
    const selectedRestaurant = useRestaurantStore((s) => s.selectedRestaurant);

    const isMine = role === 'RESTAURANT_ADMIN' || role === 'RESTAURANT_STAFF';
    const isPlatformScoped = role === 'PLATFORM_ADMIN' && !!selectedRestaurant;

    const endpoint = isMine ? EndPoints.ORDER_MINE : EndPoints.ORDER;
    const params: Record<string, unknown> = {
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
        ...(filters.foodStatus && { foodStatus: filters.foodStatus }),
        ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
        ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
        ...(isPlatformScoped && { restaurantId: selectedRestaurant!.id }),
    };

    return useQuery<OrdersPageResponse>({
        queryKey: ["orders", role, selectedRestaurant?.id, filters],
        queryFn: () =>
            axiosInstance.get<OrdersPageResponse>(endpoint, { params }).then((r) => r.data),
        staleTime: 0,
        retry: 2,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            axiosInstance.put(`orders/update-status/${id}`, { status }).then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Order status updated");
        },
        onError: () => toast.error("Failed to update order status"),
    });
};

export const useCreateWalkInOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: {
            customerName: string;
            customerPhone?: string;
            note?: string;
            items: { foodMenuId: number; quantity: number }[];
        }) => axiosInstance.post("orders/walkin", dto).then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Walk-in order created");
        },
        onError: () => toast.error("Failed to create walk-in order"),
    });
};

export default useOrders;
