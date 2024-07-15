import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/api-client.ts";
import {EndPoints} from "@/constants/constants.ts";

export interface DashboardResponse {
    totalCategory: number;
    totalFoodMenu: number
    totalOrdersForToday: number;
    totalOrdersPreviousMonth: number;
    totalOrdersYesterday: number;
    totalOrdersthisMonth: string;
    totalSalesPreviousMonth: number;
    totalSalesYesterday: number;
    totalSalesthisMonth: string;
    totalTodaySales: number;
    totalorder: number;
}

const apiClient = new APIClient<DashboardResponse, null>(EndPoints.DASHBOARD);
const UseDashboard = () => {
    return useQuery<DashboardResponse>({
        queryKey: ['dashboard'],
        queryFn: apiClient.getAll,
        staleTime: 0,
        retry: 2
    });
};


export default UseDashboard;