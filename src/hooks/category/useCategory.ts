import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api-client.ts";
import { EndPoints, QueryKeys } from "@/constants/constants";
import useAuthStore from "@/store/useAuthStore.ts";
import useRestaurantStore from "@/store/useRestaurantStore";

export interface CategoryResponse {
    id: number | null;
    name: string;
    description: string;
    menuCount: number;
    createdAt?: string;
    updatedAt?: string;
}

const UseCategory = () => {
    const role = useAuthStore((s) => s.user?.role);
    const selectedRestaurant = useRestaurantStore((s) => s.selectedRestaurant);

    const isMine = role === 'RESTAURANT_ADMIN' || role === 'RESTAURANT_STAFF';
    const isPlatformScoped = role === 'PLATFORM_ADMIN' && !!selectedRestaurant;

    let endpoint = EndPoints.CATEGORY;
    let params: Record<string, unknown> | undefined;

    if (isMine) {
        endpoint = EndPoints.CATEGORY_MINE;
    } else if (isPlatformScoped) {
        params = { restaurantId: selectedRestaurant!.id };
    }

    return useQuery<CategoryResponse[]>({
        queryKey: [QueryKeys.CATEGORY, isMine, selectedRestaurant?.id],
        queryFn: () => axiosInstance.get<CategoryResponse[]>(endpoint, { params }).then((r) => r.data),
        staleTime: 0,
        retry: 2,
    });
};

export default UseCategory;
