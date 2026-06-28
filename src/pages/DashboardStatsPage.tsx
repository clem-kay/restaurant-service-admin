import { ShoppingCart, TrendingUp, Package, Utensils, DollarSign, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDashboard from "@/hooks/dashboard/useDashboard";

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

const DashboardStatsPage = () => {
    const { data, isLoading, isError } = useDashboard();

    if (isLoading) {
        return (
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-28 rounded-lg border bg-muted/40 animate-pulse" />
                    ))}
                </div>
            </main>
        );
    }

    if (isError || !data) {
        return (
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
                <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground">
                    Failed to load dashboard stats. Make sure the backend is running.
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Revenue"
                    value={`GHS ${data.totalRevenue?.toFixed(2) ?? "0.00"}`}
                    icon={DollarSign}
                    description="All-time platform revenue"
                />
                <StatCard
                    title="Total Orders"
                    value={data.totalOrders ?? 0}
                    icon={ShoppingCart}
                    description="All-time orders placed"
                />
                <StatCard
                    title="Today's Sales"
                    value={`GHS ${data.todaySales?.toFixed(2) ?? "0.00"}`}
                    icon={TrendingUp}
                    description="Revenue collected today"
                />
                <StatCard
                    title="Today's Orders"
                    value={data.todayOrders ?? 0}
                    icon={BarChart3}
                    description="Orders placed today"
                />
                <StatCard
                    title="Menu Items"
                    value={data.totalFoodItems ?? 0}
                    icon={Utensils}
                    description="Total food items listed"
                />
                <StatCard
                    title="Categories"
                    value={data.totalCategories ?? 0}
                    icon={Package}
                    description="Active food categories"
                />
            </div>
        </main>
    );
};

export default DashboardStatsPage;
