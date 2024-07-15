import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

interface DashboardCardProps {
    title: string;
    value: string;
    percentageChange: string;
    icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, percentageChange, icon }) => {
    return (
        <Card className='w-[30%] hover:bg-muted'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{percentageChange}</p>
            </CardContent>
        </Card>
    );
};

export default DashboardCard;
