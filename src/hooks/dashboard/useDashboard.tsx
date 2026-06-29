import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api-client";
import { EndPoints } from "@/constants/constants";
import useAuthStore from "@/store/useAuthStore";
import useRestaurantStore from "@/store/useRestaurantStore";

export interface PlatformDashboardStats {
    totalRestaurants: number;
    pendingApprovals: number;
    totalUsers: number;
    totalCustomers: number;
    totalRiders: number;
    totalOrders: number;
    todayOrders: number;
    totalRevenue: number;
    todaySales: number;
    totalFoodItems: number;
    totalCategories: number;
}

export interface RestaurantDashboardStats {
    totalOrders: number;
    todayOrders: number;
    totalRevenue: number;
    todaySales: number;
    prevMonthOrders: number;
    prevMonthRevenue: number;
    totalFoodItems: number;
    totalCategories: number;
    totalStaff: number;
}

export type DashboardStats = PlatformDashboardStats | RestaurantDashboardStats;

const useDashboard = () => {
    const role = useAuthStore((s) => s.user?.role);
    const selectedRestaurant = useRestaurantStore((s) => s.selectedRestaurant);

    const params: Record<string, unknown> = {};
    if (role === 'PLATFORM_ADMIN' && selectedRestaurant) {
        params.restaurantId = selectedRestaurant.id;
    }

    return useQuery<DashboardStats>({
        queryKey: ["dashboard", role, selectedRestaurant?.id],
        queryFn: () =>
            axiosInstance
                .get<DashboardStats>(EndPoints.DASHBOARD, { params: Object.keys(params).length ? params : undefined })
                .then((r) => r.data),
        staleTime: 60_000,
        retry: 2,
    });
};

export default useDashboard;
