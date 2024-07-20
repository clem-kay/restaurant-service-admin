import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderResponseMany } from "@/hooks/order/useOrders";
import { formatDate } from "@/utils/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import useUpdateOrderStatus from "@/hooks/order/useUpdateOrderStatus";
import useUpdatePaymentStatus from "@/hooks/order/useUpdatePaymentStatus";
import useOrderStore from "@/store/useOrderStore.tsx";
import { CURRENCY } from "@/constants/constants.ts";

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

const getFoodStatusValue = (status: keyof FoodStatus): 'default' | 'success' | 'outline' | 'destructive' | 'gray' | 'orange' => {
    return foodStatus[status];
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onClickRow }) => {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const userAccountId = useOrderStore(s => s.userAccountId);
    const updateOrder = useOrderStore(s => s.updateOrder);

    const ordersPerPage = 10;

    const { mutate: updateOrderStatus } = useUpdateOrderStatus();
    const { mutate: updatePaymentStatus } = useUpdatePaymentStatus();

    useEffect(() => {
        if (orders && orders.length > 0) {
            setSelectedOrderId(orders[0].id);
        }
    }, [orders]);

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders?.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleUpdateOrderStatus = (orderId: number, status: keyof FoodStatus) => {
        const optimisticUpdate = { food_status: status };
        updateOrder(orderId, optimisticUpdate);

        updateOrderStatus({
            orderId,
            statusData: { status, userId: userAccountId as number }
        }, {
            onSuccess: (data) => {
                updateOrder(orderId, { food_status: data.food_status });
            },
            onError: () => {
                // Rollback in case of error
                updateOrder(orderId, { food_status: orders.find(order => order.id === orderId)?.food_status });
            }
        });
    };

    const handleUpdatePaymentStatus = (orderId: number, status: boolean) => {
        const optimisticUpdate = { paid: status };
        updateOrder(orderId, optimisticUpdate);

        updatePaymentStatus({
            orderId,
            statusData: { status, userId: orderId }
        }, {
            onSuccess: (data) => {
                updateOrder(orderId, { paid: data.paid });
            },
            onError: () => {
                // Rollback in case of error
                updateOrder(orderId, { paid: orders.find(order => order.id === orderId)?.paid });
            }
        });
    };

    return (
        <Card className='flex-grow'>
            <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>Check out recent orders. Click on customer records to view order details</CardDescription>
            </CardHeader>
            <CardContent>
                {orders && orders.length > 0 ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden sm:table-cell">Paid</TableHead>
                                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="text-right">Amount {CURRENCY}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentOrders.map((order, index) => (
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
                                        <TableCell className="hidden sm:table-cell"
                                                   onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <div>
                                                        <Badge className="text-xs"
                                                               variant={order.paid ? 'success' : 'outline'}>
                                                            {order.paid ? 'Yes' : 'No'}
                                                        </Badge>
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Paid Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem className='hover:bg-accent'
                                                                      onClick={() => handleUpdatePaymentStatus(order.id, true)}>Yes</DropdownMenuItem>
                                                    <DropdownMenuItem className='hover:bg-accent'
                                                                      onClick={() => handleUpdatePaymentStatus(order.id, false)}>No</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell"
                                                   onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <div>
                                                        <Badge className="text-xs"
                                                               variant={getFoodStatusValue(order.food_status as keyof FoodStatus)}>
                                                            {order.food_status}
                                                        </Badge>
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Food Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator/>
                                                    {Object.keys(foodStatus).map(status => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            className={`hover:bg-accent ${status === 'CANCELLED' ? 'hover:bg-destructive' : ''}`}
                                                            onClick={() => handleUpdateOrderStatus(order.id, status as keyof FoodStatus)}
                                                        >
                                                            {status}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell
                                            className="hidden md:table-cell">{order.updatedAt ? formatDate(order.updatedAt) : formatDate(order.createdAt)}</TableCell>
                                        <TableCell className="text-right">{order.totalAmount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div>
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={indexOfLastOrder >= orders.length}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
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
