import { useState } from "react";
import useOrders, { useUpdateOrderStatus, useCreateWalkInOrder } from "@/hooks/orders/useOrders";
import UseMenu from "@/hooks/menu/useMenu";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, PlusCircle, Minus, Plus, Trash2 } from "lucide-react";

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

const FOOD_STATUSES = ["PENDING", "ACCEPTED", "PREPARING", "READY", "PICKED_UP", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED", "COD_PENDING"];

// Next valid status transitions for restaurant staff
const STATUS_TRANSITIONS: Record<string, string[]> = {
    PENDING:   ["ACCEPTED", "CANCELLED"],
    ACCEPTED:  ["PREPARING", "CANCELLED"],
    PREPARING: ["READY", "CANCELLED"],
    READY:     ["PICKED_UP"],
    PICKED_UP: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};

interface WalkInItem { foodMenuId: number; name: string; price: number; quantity: number }

const OrdersPage = () => {
    const role = useAuthStore((s) => s.user?.role);
    const isRestaurantRole = role === 'RESTAURANT_ADMIN' || role === 'RESTAURANT_STAFF';

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
    const totalPages = data?.totalPages ?? Math.ceil(total / 20);

    const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

    // Walk-in order state
    const [walkInOpen, setWalkInOpen] = useState(false);
    const [walkInName, setWalkInName] = useState("");
    const [walkInPhone, setWalkInPhone] = useState("");
    const [walkInNote, setWalkInNote] = useState("");
    const [walkInItems, setWalkInItems] = useState<WalkInItem[]>([]);
    const [menuSearch, setMenuSearch] = useState("");

    const resetWalkIn = () => {
        setWalkInName(""); setWalkInPhone(""); setWalkInNote(""); setWalkInItems([]); setMenuSearch("");
    };

    const { data: menuData } = UseMenu();
    const { mutate: createWalkIn, isPending: isCreatingWalkIn } = useCreateWalkInOrder();

    const addMenuItem = (item: { id: number; name: string; price: number }) => {
        setWalkInItems((prev) => {
            const existing = prev.find((i) => i.foodMenuId === item.id);
            if (existing) return prev.map((i) => i.foodMenuId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { foodMenuId: item.id, name: item.name, price: item.price, quantity: 1 }];
        });
    };

    const updateItemQty = (foodMenuId: number, delta: number) => {
        setWalkInItems((prev) =>
            prev.map((i) => i.foodMenuId === foodMenuId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        );
    };

    const removeItem = (foodMenuId: number) => {
        setWalkInItems((prev) => prev.filter((i) => i.foodMenuId !== foodMenuId));
    };

    const walkInTotal = walkInItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleWalkInSubmit = () => {
        if (!walkInName.trim() || walkInItems.length === 0) return;
        createWalkIn(
            {
                customerName: walkInName,
                customerPhone: walkInPhone || undefined,
                note: walkInNote || undefined,
                items: walkInItems.map((i) => ({ foodMenuId: i.foodMenuId, quantity: i.quantity })),
            },
            {
                onSuccess: () => {
                    setWalkInOpen(false);
                    resetWalkIn();
                },
            }
        );
    };

    const customerName = (order: typeof orders[0]) => {
        if (order.walkInName) return `${order.walkInName} (Walk-in)`;
        if (order.customer) return `${order.customer.firstName} ${order.customer.lastName}`;
        return "—";
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
                    <span className="text-sm text-muted-foreground">{total} total</span>
                </div>
                {isRestaurantRole && (
                    <Button size="sm" className="gap-1.5" onClick={() => setWalkInOpen(true)}>
                        <PlusCircle className="h-4 w-4" />
                        Walk-in Order
                    </Button>
                )}
            </div>

            <div className="flex gap-3 flex-wrap">
                <select
                    value={foodStatus}
                    onChange={(e) => { setFoodStatus(e.target.value); setPage(1); }}
                    className="text-sm border rounded-md px-3 py-1.5 bg-background"
                >
                    <option value="">All Food Statuses</option>
                    {FOOD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                    value={paymentStatus}
                    onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
                    className="text-sm border rounded-md px-3 py-1.5 bg-background"
                >
                    <option value="">All Payment Statuses</option>
                    {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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
                    <div className="rounded-lg border overflow-x-auto">
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
                                    {isRestaurantRole && <TableHead>Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => {
                                    const nextStatuses = STATUS_TRANSITIONS[order.foodStatus] ?? [];
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-sm">#{order.id}</TableCell>
                                            <TableCell className="whitespace-nowrap">{order.restaurant?.name ?? "—"}</TableCell>
                                            <TableCell className="whitespace-nowrap">{customerName(order)}</TableCell>
                                            <TableCell className="whitespace-nowrap">GHS {order.totalAmount?.toFixed(2)}</TableCell>
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
                                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                {order.paymentMethod === "CASH_ON_DELIVERY" ? "COD" : "Card"}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            {isRestaurantRole && (
                                                <TableCell>
                                                    {nextStatuses.length > 0 ? (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" disabled={isUpdating}>
                                                                    Update <ChevronDown className="h-3 w-3" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {nextStatuses.map((s) => (
                                                                    <DropdownMenuItem
                                                                        key={s}
                                                                        className={s === 'CANCELLED' ? 'text-destructive' : ''}
                                                                        onClick={() => updateStatus({ id: order.id, status: s })}
                                                                    >
                                                                        → {s}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Walk-in Order Dialog */}
            <Dialog open={walkInOpen} onOpenChange={(open) => { setWalkInOpen(open); if (!open) resetWalkIn(); }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Walk-in Order</DialogTitle>
                        <DialogDescription>Create an order for a customer at the counter.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 py-1">
                        <div className="grid gap-1.5">
                            <Label htmlFor="wi-name">Customer Name *</Label>
                            <Input id="wi-name" placeholder="John Doe" value={walkInName} onChange={(e) => setWalkInName(e.target.value)} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="wi-phone">Phone (optional)</Label>
                            <Input id="wi-phone" placeholder="+233..." value={walkInPhone} onChange={(e) => setWalkInPhone(e.target.value)} />
                        </div>

                        {/* Menu selection */}
                        <div>
                            <Label className="block mb-2">Add Items</Label>
                            <Input
                                placeholder="Search menu..."
                                value={menuSearch}
                                onChange={(e) => setMenuSearch(e.target.value)}
                                className="mb-2"
                            />
                            <div className="border rounded-md max-h-44 overflow-y-auto divide-y">
                                {!menuData || menuData.length === 0 ? (
                                    <p className="text-xs text-muted-foreground p-3">No menu items available</p>
                                ) : menuData
                                    .filter((item) => item.name.toLowerCase().includes(menuSearch.toLowerCase()))
                                    .map((item) => (
                                        <div key={item.id} className="flex items-center justify-between px-3 py-2">
                                            <div>
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">GHS {item.price?.toFixed(2)}</p>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs"
                                                onClick={() => addMenuItem({ id: item.id, name: item.name, price: item.price })}>
                                                <Plus className="h-3 w-3" /> Add
                                            </Button>
                                        </div>
                                    ))}
                                {menuData && menuData.length > 0 && menuSearch &&
                                    menuData.filter((item) => item.name.toLowerCase().includes(menuSearch.toLowerCase())).length === 0 && (
                                    <p className="text-xs text-muted-foreground p-3">No items match "{menuSearch}"</p>
                                )}
                            </div>
                        </div>

                        {/* Selected items */}
                        {walkInItems.length > 0 && (
                            <div>
                                <Label className="block mb-2">Selected Items</Label>
                                <div className="border rounded-md divide-y">
                                    {walkInItems.map((item) => (
                                        <div key={item.foodMenuId} className="flex items-center justify-between px-3 py-2">
                                            <div>
                                                <p className="text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">GHS {(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateItemQty(item.foodMenuId, -1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm w-5 text-center">{item.quantity}</span>
                                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateItemQty(item.foodMenuId, 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeItem(item.foodMenuId)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between px-3 py-2 font-medium text-sm">
                                        <span>Total</span>
                                        <span>GHS {walkInTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-1.5">
                            <Label htmlFor="wi-note">Note (optional)</Label>
                            <Input id="wi-note" placeholder="Special instructions..." value={walkInNote} onChange={(e) => setWalkInNote(e.target.value)} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setWalkInOpen(false); resetWalkIn(); }}>Cancel</Button>
                        <Button
                            onClick={handleWalkInSubmit}
                            disabled={isCreatingWalkIn || !walkInName.trim() || walkInItems.length === 0}
                        >
                            {isCreatingWalkIn ? "Creating..." : `Create Order · GHS ${walkInTotal.toFixed(2)}`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
};

export default OrdersPage;
