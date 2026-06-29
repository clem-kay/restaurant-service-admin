import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api-client.ts";
import { EndPoints, QueryKeys } from "@/constants/constants.ts";
import useAuthStore from "@/store/useAuthStore.ts";
import useRestaurantStore from "@/store/useRestaurantStore";

export interface MenuResponse {
    id: number;
    name: string;
    price: number;
    menuCount: number;
    quantity: number;
    imageUrl?: string | null;
    description?: string;
    userAccountId: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
}

const UseMenu = () => {
    const role = useAuthStore((s) => s.user?.role);
    const selectedRestaurant = useRestaurantStore((s) => s.selectedRestaurant);

    const isMine = role === 'RESTAURANT_ADMIN' || role === 'RESTAURANT_STAFF';
    const isPlatformScoped = role === 'PLATFORM_ADMIN' && !!selectedRestaurant;

    let endpoint = EndPoints.MENU;
    let params: Record<string, unknown> | undefined;

    if (isMine) {
        endpoint = EndPoints.MENU_MINE;
    } else if (isPlatformScoped) {
        params = { restaurantId: selectedRestaurant!.id };
    }

    return useQuery<MenuResponse[]>({
        queryKey: [QueryKeys.MENU, isMine, selectedRestaurant?.id],
        queryFn: () => axiosInstance.get<MenuResponse[]>(endpoint, { params }).then((r) => r.data),
        staleTime: 0,
        retry: 2,
    });
};

export default UseMenu;
