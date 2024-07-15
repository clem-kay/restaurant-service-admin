import React from 'react';
import {CreditCard, DollarSign, Package, Package2, ShoppingCart, Users} from "lucide-react";
import DashboardCard from "@/components/Dashboard/overview/DashboardCard";
import useDashboard, {DashboardResponse} from '@/hooks/analytics/useDashboard';

const mapDashboardDataToCardData = (data: DashboardResponse) => {
    return [
        {
            title: "Total Revenue",
            value: `¢${data.totalSalesthisMonth}`,
            percentageChange: "+19% from last month",
            icon: <DollarSign className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Orders",
            value: `${data.totalorder}`,
            percentageChange: "+20% from last month",
            icon: <ShoppingCart className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Sales Today",
            value: `¢${data.totalTodaySales}`,
            percentageChange: "+10% from yesterday",
            icon: <CreditCard className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Orders Today",
            value: `${data.totalOrdersForToday}`,
            percentageChange: "+5% from yesterday",
            icon: <Package className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Orders This Month",
            value: `${data.totalOrdersthisMonth}`,
            percentageChange: "+25% from last month",
            icon: <Package2 className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Orders Yesterday",
            value: `${data.totalOrdersYesterday}`,
            percentageChange: "-10% from today",
            icon: <Package2 className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Sales Yesterday",
            value: `¢${data.totalSalesYesterday}`,
            percentageChange: "-15% from today",
            icon: <CreditCard className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Sales Previous Month",
            value: `¢${data.totalSalesPreviousMonth}`,
            percentageChange: "-20% from this month",
            icon: <DollarSign className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Orders Previous Month",
            value: `${data.totalOrdersPreviousMonth}`,
            percentageChange: "-30% from this month",
            icon: <ShoppingCart className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Food Menu",
            value: `${data.totalFoodMenu}`,
            percentageChange: "+15% from last month",
            icon: <Users className="h-4 w-4 text-muted-foreground"/>
        },
        {
            title: "Total Category",
            value: `${data.totalCategory}`,
            percentageChange: "+8% from last month",
            icon: <Users className="h-4 w-4 text-muted-foreground"/>
        }
    ];
};

const Dashboard: React.FC = () => {
    const {data: dashboardData} = useDashboard();

    const cardData = dashboardData ? mapDashboardDataToCardData(dashboardData) : [];

    return (
        <div className="flex justify-between flex-wrap gap-4">
            {cardData.map((data, index) => (
                <DashboardCard
                    key={index}
                    title={data.title}
                    value={data.value}
                    percentageChange={data.percentageChange}
                    icon={data.icon}
                />
            ))}
        </div>
    );
};

export default Dashboard;
