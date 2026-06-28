import { useQuery } from "@tanstack/react-query";
import APIClient from "@/services/api-client";
import { EndPoints } from "@/constants/constants";

export interface DashboardStats {
    totalCategories: number;
    totalOrders: number;
    totalRevenue: number;
    totalFoodItems: number;
    todayOrders: number;
    todaySales: number;
}

const apiClient = new APIClient<DashboardStats, null>(EndPoints.DASHBOARD);

const useDashboard = () => {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard"],
        queryFn: apiClient.getAll,
        staleTime: 60_000,
        retry: 2,
    });
};

export default useDashboard;
