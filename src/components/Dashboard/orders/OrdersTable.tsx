import React, {useEffect, useState} from 'react';
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {OrderResponseMany} from "@/hooks/order/useOrders";
import {formatDate} from "@/utils/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface OrdersTableProps {
    orders: OrderResponseMany[];
    onClickRow: (order: OrderResponseMany) => void;
}

interface FoodStatus {
    ACCEPTED: 'default';
    PENDING: 'outline';
    COOKING: 'orange';
    COMPLETED: 'success';
    CANCELLED: 'destructive';
}

const foodStatus: FoodStatus = {
    ACCEPTED: 'default',
    PENDING: 'outline',
    COOKING: 'orange',
    COMPLETED: 'success',
    CANCELLED: 'destructive'
};

const getFoodStatusValue = (status: keyof FoodStatus): 'default' | 'success' | 'outline' | 'destructive'| 'gray' | 'orange' => {
    return foodStatus[status];
};

const OrdersTable: React.FC<OrdersTableProps> = ({orders, onClickRow}) => {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [paidStatus, setPaidStatus] = useState<Record<number, boolean>>({});
    const [foodStatuses, setFoodStatuses] = useState<Record<number, keyof FoodStatus>>({});

    useEffect(() => {
        if (orders && orders.length > 0) {
            setSelectedOrderId(orders[0].id);
            const initialPaidStatus = orders.reduce((acc, order) => {
                acc[order.id] = order.paid;
                return acc;
            }, {} as Record<number, boolean>);
            const initialFoodStatuses = orders.reduce((acc, order) => {
                acc[order.id] = order.food_status as keyof FoodStatus;
                return acc;
            }, {} as Record<number, keyof FoodStatus>);
            setPaidStatus(initialPaidStatus);
            setFoodStatuses(initialFoodStatuses);
        }
    }, [orders]);

    const handlePaidStatusChange = (orderId: number, value: boolean) => {
        setPaidStatus(prev => ({...prev, [orderId]: value}));
    };

    const handleFoodStatusChange = (orderId: number, value: keyof FoodStatus) => {
        setFoodStatuses(prev => ({...prev, [orderId]: value}));
    };

    return (
        <Card className='flex-grow'>
            <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>Check out recent orders. Click on customer records to view order
                    Details</CardDescription>
            </CardHeader>
            <CardContent>
                {orders && orders.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="hidden sm:table-cell">Paid</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead className="text-right">Amount ₵</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow
                                    className={`cursor-pointer ${selectedOrderId === order.id ? 'bg-muted' : ''}`}
                                    key={index}
                                    onClick={() => {
                                        onClickRow(order);
                                        setSelectedOrderId(order.id);
                                    }}
                                >
                                    <TableCell>
                                        <div className="font-medium">{order.name}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {order.email || ''}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <div>
                                                    <Badge className="text-xs"
                                                           variant={paidStatus[order.id] ? 'success' : 'outline'}>
                                                        {paidStatus[order.id] ? 'Yes' : 'No'}
                                                    </Badge>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Paid Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem className='hover:bg-accent'
                                                                  onClick={() => handlePaidStatusChange(order.id, true)}>Yes</DropdownMenuItem>
                                                <DropdownMenuItem className='hover:bg-accent'
                                                                  onClick={() => handlePaidStatusChange(order.id, false)}>No</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <div>
                                                    <Badge className="text-xs"
                                                           variant={getFoodStatusValue(foodStatuses[order.id])}>
                                                        {foodStatuses[order.id]}
                                                    </Badge>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Food Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                {Object.keys(foodStatus).map(status => (
                                                    <DropdownMenuItem
                                                        key={status}
                                                        className={`hover:bg-accent ${status === 'CANCELLED'? 'hover:bg-destructive': ''}`}
                                                        onClick={() => handleFoodStatusChange(order.id, status as keyof FoodStatus)}
                                                    >
                                                        {status}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell
                                        className="hidden md:table-cell">{formatDate(order.createdAt)}</TableCell>
                                    <TableCell className="text-right">{order.totalAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground">You have no orders 😓.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrdersTable;
