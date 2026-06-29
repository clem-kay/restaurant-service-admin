import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api-client";
import { EndPoints } from "@/constants/constants";
import toast from "react-hot-toast";

export interface RestaurantResponse {
    id: number;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    isOpen: boolean;
    isApproved: boolean;
    onboardingMethod: string;
    deliveryFee: number;
    estimatedMinutes: number;
    createdAt: string;
    owner?: { profile?: { firstname?: string; lastname?: string; email?: string } };
}

export interface CreateRestaurantDto {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    email?: string;
    deliveryFee?: number;
    estimatedMinutes?: number;
    description?: string;
    commissionRate?: number;
    adminUsername: string;
    adminPassword: string;
}

export const useRestaurants = (filters: { isApproved?: boolean; isOpen?: boolean } = {}) => {
    return useQuery<RestaurantResponse[]>({
        queryKey: ["restaurants", filters],
        queryFn: () =>
            axiosInstance
                .get(EndPoints.RESTAURANTS, {
                    params: {
                        ...(filters.isApproved !== undefined && { isApproved: filters.isApproved }),
                        ...(filters.isOpen !== undefined && { isOpen: filters.isOpen }),
                    },
                })
                .then((res) => res.data),
        staleTime: 0,
        retry: 2,
    });
};

export const usePendingRestaurants = () => {
    return useQuery<RestaurantResponse[]>({
        queryKey: ["restaurants-pending"],
        queryFn: () =>
            axiosInstance.get(EndPoints.RESTAURANT_PENDING).then((res) => res.data),
        staleTime: 0,
        retry: 2,
    });
};

export const useApproveRestaurant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, approve }: { id: number; approve: boolean }) =>
            axiosInstance.patch(`restaurant/${id}/approve`, { approve }).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurants"] });
            queryClient.invalidateQueries({ queryKey: ["restaurants-pending"] });
            toast.success("Restaurant status updated");
        },
        onError: () => toast.error("Failed to update restaurant status"),
    });
};

export const useCreateRestaurant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateRestaurantDto) =>
            axiosInstance.post("restaurant/admin/create", dto).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurants"] });
            toast.success("Restaurant created successfully");
        },
        onError: () => toast.error("Failed to create restaurant"),
    });
};

export default useRestaurants;
