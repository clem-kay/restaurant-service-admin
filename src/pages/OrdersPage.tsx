import { useState } from "react";
import useOrders from "@/hooks/orders/useOrders";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-blue-100 text-blue-800",
    PREPARING: "bg-purple-100 text-purple-800",
    READY: "bg-indigo-100 text-indigo-800",
    PICKED_UP: "bg-orange-100 text-orange-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    COD_PENDING: "bg-yellow-100 text-yellow-800",
    REFUNDED: "bg-gray-100 text-gray-800",
};

const FOOD_STATUSES = ["", "PENDING", "ACCEPTED", "PREPARING", "READY", "PICKED_UP", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["", "PENDING", "PAID", "FAILED", "REFUNDED", "COD_PENDING"];

const OrdersPage = () => {
    const [page, setPage] = useState(1);
    const [foodStatus, setFoodStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");

    const { data, isLoading, isError } = useOrders({
        page,
        limit: 20,
        foodStatus: foodStatus || undefined,
        paymentStatus: paymentStatus || undefined,
    });

    const orders = data?.data ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / 20);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
                <span className="text-sm text-muted-foreground">{total} total</span>
            </div>

            <div className="flex gap-3 flex-wrap">
                <select
                    value={foodStatus}
                    onChange={(e) => { setFoodStatus(e.target.value); setPage(1); }}
                    className="text-sm border rounded-md px-3 py-1.5 bg-background"
                >
                    <option value="">All Food Statuses</option>
                    {FOOD_STATUSES.slice(1).map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <select
                    value={paymentStatus}
                    onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
                    className="text-sm border rounded-md px-3 py-1.5 bg-background"
                >
                    <option value="">All Payment Statuses</option>
                    {PAYMENT_STATUSES.slice(1).map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading orders...</div>
            ) : isError ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    Failed to load orders.
                </div>
            ) : orders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center text-muted-foreground">No orders found.</div>
                </div>
            ) : (
                <>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Restaurant</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Food Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-sm">#{order.id}</TableCell>
                                        <TableCell>{order.restaurant?.name ?? "—"}</TableCell>
                                        <TableCell>
                                            {order.customer
                                                ? `${order.customer.firstName} ${order.customer.lastName}`
                                                : "—"}
                                        </TableCell>
                                        <TableCell>GHS {order.totalAmount?.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[order.foodStatus] ?? "bg-gray-100 text-gray-800"}`}>
                                                {order.foodStatus}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[order.paymentStatus] ?? "bg-gray-100 text-gray-800"}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {order.paymentMethod === "CASH_ON_DELIVERY" ? "COD" : "Card"}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default OrdersPage;
