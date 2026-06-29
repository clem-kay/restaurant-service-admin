import { axiosInstance } from "@/services/api-client.ts";
import { EndPoints } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore.ts";
import useRestaurantStore from "@/store/useRestaurantStore";

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
    const role = useAuthStore((s) => s.user?.role);
    const selectedRestaurant = useRestaurantStore((s) => s.selectedRestaurant);

    const isMine = role === 'RESTAURANT_ADMIN' || role === 'RESTAURANT_STAFF';
    const isPlatformScoped = role === 'PLATFORM_ADMIN' && !!selectedRestaurant;

    let endpoint = EndPoints.ORDER;
    let params: Record<string, unknown> | undefined;

    if (isMine) {
        endpoint = EndPoints.ORDER_MINE;
    } else if (isPlatformScoped) {
        params = { restaurantId: selectedRestaurant!.id };
    }

    return useQuery<OrderResponseMany[]>({
        queryKey: ['orders', isMine, selectedRestaurant?.id],
        queryFn: () => axiosInstance.get<OrderResponseMany[]>(endpoint, { params }).then((r) => r.data),
        staleTime: 0,
        retry: 2,
    });
};

export default useOrders;
