import React from 'react';
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatDate} from "@/utils/utils.ts";
import {OrderResponseMany} from "@/hooks/order/useOrders.ts";
// import OrderTableHeaderButtons from "@/components/Dashboard/orders/OrderTableHeaderButtons.tsx";

interface OrdersTableProps {
    orders: OrderResponseMany[];
    onClickRow: (order: OrderResponseMany) => void;
}

interface FoodStatus {
    ACCEPTED: 'default';
    PENDING: 'outline';
    COOKING: 'outline';
    COMPLETED: 'success';
    CANCELLED: 'destructive';
}

const foodStatus: FoodStatus = {
    ACCEPTED: 'default',
    PENDING: 'outline',
    COOKING: 'outline',
    COMPLETED: 'success',
    CANCELLED: 'destructive'
};

const getFoodStatusValue = (status: keyof FoodStatus): 'default' | 'success' | 'outline' | 'destructive' => {
    return foodStatus[status];
}

const OrdersTable: React.FC<OrdersTableProps> = ({orders, onClickRow}) => {

    return (
        <Card className='flex-grow'>
            {/*<OrderTableHeaderButtons/>*/}
            <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>Check out recent orders. Click on customer records to view order Details</CardDescription>
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
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow key={index} onClick={() => onClickRow(order)}>
                                    <TableCell>
                                        <div className="font-medium">{order.name}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {order.email || ''}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge className="text-xs"
                                               variant={order.paid ? 'success' : 'outline'}>
                                            {order.paid ? 'Yes' : 'No'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge className="text-xs"
                                               variant={getFoodStatusValue(order.food_status as keyof FoodStatus)}>
                                            {order.food_status}
                                        </Badge>
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
