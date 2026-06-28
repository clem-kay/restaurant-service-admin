import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "@/services/api-client";
import { EndPoints } from "@/constants/constants";
import toast from "react-hot-toast";

export interface RiderResponse {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    vehicleType: string;
    vehiclePlate?: string;
    isAvailable: boolean;
    isApproved: boolean;
    totalEarnings: number;
    createdAt: string;
    account?: { username: string; profile?: { email?: string } };
}

const apiClient = new APIClient<RiderResponse[], RiderResponse>(EndPoints.RIDERS);

export const useRiders = (filters: { isApproved?: boolean; isAvailable?: boolean } = {}) => {
    return useQuery<RiderResponse[]>({
        queryKey: ["riders", filters],
        queryFn: () =>
            apiClient.getAll({
                params: {
                    ...(filters.isApproved !== undefined && { isApproved: filters.isApproved }),
                    ...(filters.isAvailable !== undefined && { isAvailable: filters.isAvailable }),
                },
            }),
        staleTime: 0,
        retry: 2,
    });
};

export const useApproveRider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, approve }: { id: number; approve: boolean }) =>
            apiClient.patchAction(`${id}/approve`, { approve }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["riders"] });
            toast.success("Rider status updated");
        },
        onError: () => toast.error("Failed to update rider status"),
    });
};

export default useRiders;
