import {
    ShoppingCart, TrendingUp, Package, Utensils, DollarSign,
    BarChart3, Store, Users, Bike, Clock, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDashboard, { PlatformDashboardStats, RestaurantDashboardStats } from "@/hooks/dashboard/useDashboard";
import useAuthStore from "@/store/useAuthStore";
import useRestaurantStore from "@/store/useRestaurantStore";

const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
}: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </CardContent>
    </Card>
);

const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg border bg-muted/40 animate-pulse" />
        ))}
    </div>
);

const PlatformDashboard = ({ data }: { data: PlatformDashboardStats }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Restaurants" value={data.totalRestaurants} icon={Store} description="All registered restaurants" />
        <StatCard
            title="Pending Approvals"
            value={data.pendingApprovals}
            icon={AlertCircle}
            description="Restaurants awaiting approval"
        />
        <StatCard title="Total Revenue" value={`GHS ${(data.totalRevenue ?? 0).toFixed(2)}`} icon={DollarSign} description="All-time platform revenue" />
        <StatCard title="Total Orders" value={data.totalOrders ?? 0} icon={ShoppingCart} description="All-time orders placed" />
        <StatCard title="Today's Sales" value={`GHS ${(data.todaySales ?? 0).toFixed(2)}`} icon={TrendingUp} description="Revenue collected today" />
        <StatCard title="Today's Orders" value={data.todayOrders ?? 0} icon={BarChart3} description="Orders placed today" />
        <StatCard title="Customers" value={data.totalCustomers ?? 0} icon={Users} description="Registered customers" />
        <StatCard title="Riders" value={data.totalRiders ?? 0} icon={Bike} description="Registered delivery riders" />
        <StatCard title="Menu Items" value={data.totalFoodItems ?? 0} icon={Utensils} description="Total food items across all restaurants" />
    </div>
);

const RestaurantDashboard = ({ data, restaurantName }: { data: RestaurantDashboardStats; restaurantName?: string }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Revenue" value={`GHS ${(data.totalRevenue ?? 0).toFixed(2)}`} icon={DollarSign} description={restaurantName ? `Revenue for ${restaurantName}` : "All-time restaurant revenue"} />
        <StatCard title="Total Orders" value={data.totalOrders ?? 0} icon={ShoppingCart} description="All-time orders" />
        <StatCard title="Today's Sales" value={`GHS ${(data.todaySales ?? 0).toFixed(2)}`} icon={TrendingUp} description="Revenue collected today" />
        <StatCard title="Today's Orders" value={data.todayOrders ?? 0} icon={BarChart3} description="Orders placed today" />
        <StatCard title="Last Month Revenue" value={`GHS ${(data.prevMonthRevenue ?? 0).toFixed(2)}`} icon={Clock} description="Previous month revenue" />
        <StatCard title="Last Month Orders" value={data.prevMonthOrders ?? 0} icon={ShoppingCart} description="Orders last month" />
        <StatCard title="Menu Items" value={data.totalFoodItems ?? 0} icon={Utensils} description="Active food items" />
        <StatCard title="Categories" value={data.totalCategories ?? 0} icon={Package} description="Active food categories" />
        <StatCard title="Staff Members" value={data.totalStaff ?? 0} icon={Users} description="Restaurant staff accounts" />
    </div>
);

const DashboardStatsPage = () => {
    const { data, isLoading, isError } = useDashboard();
    const role = useAuthStore((s) => s.user?.role);
    const selectedRestaurant = useRestaurantStore((s) => s.selectedRestaurant);

    const isPlatformAdmin = role === 'PLATFORM_ADMIN';
    const isPlatformScoped = isPlatformAdmin && !!selectedRestaurant;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
                <SkeletonGrid count={isPlatformAdmin && !selectedRestaurant ? 9 : 9} />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
                <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground">
                    Failed to load dashboard stats. Make sure the backend is running.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
                {isPlatformAdmin && !isPlatformScoped && (
                    <p className="text-sm text-muted-foreground mt-0.5">Platform-wide overview</p>
                )}
                {isPlatformScoped && (
                    <p className="text-sm text-muted-foreground mt-0.5">Stats for {selectedRestaurant.name}</p>
                )}
            </div>
            {isPlatformAdmin && !isPlatformScoped ? (
                <PlatformDashboard data={data as PlatformDashboardStats} />
            ) : (
                <RestaurantDashboard
                    data={data as RestaurantDashboardStats}
                    restaurantName={selectedRestaurant?.name}
                />
            )}
        </div>
    );
};

export default DashboardStatsPage;
