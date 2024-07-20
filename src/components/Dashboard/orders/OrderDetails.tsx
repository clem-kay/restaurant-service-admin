import {forwardRef, useEffect, useRef, useState} from "react";
import {Copy, Printer, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {OrderResponseMany} from "@/hooks/order/useOrders";
import {formatCurrency, formatDate} from "@/utils/utils";
import useOrder from "@/hooks/order/useOrder";
import {useReactToPrint} from "react-to-print";
import useOrderStore from "@/store/useOrderStore.tsx";
import {CURRENCY} from "@/constants/constants.ts";

interface OrderDetailsProps {
    selectedOrder: OrderResponseMany | null;
    onClose: () => void;
}

const OrderDetails = forwardRef<HTMLDivElement, OrderDetailsProps>(({selectedOrder, onClose}) => {
    const {data: orderItem} = useOrder(selectedOrder?.id);
    const [subtotal, setSubtotal] = useState(0);
    const componentRef = useRef<HTMLDivElement>(null);
    const setUserAccountId = useOrderStore((state) => state.setUserAccountId);

    useEffect(() => {
        if (orderItem) {
            const total = orderItem.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
            setSubtotal(total);
            setUserAccountId(orderItem.orderItems[0]?.foodMenu.userAccountId);
        }
    }, [orderItem, setUserAccountId]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onBeforePrint: () => {
            const buttonsDiv = document.querySelector('.print-hide');
            if (buttonsDiv) {
                buttonsDiv.classList.add('hidden');
            }
        },
        onAfterPrint: () => {
            const buttonsDiv = document.querySelector('.print-hide');
            if (buttonsDiv) {
                buttonsDiv.classList.remove('hidden');
            }
        },
    });

    if (!selectedOrder) return null;

    return (
        <>
            <div className="ml-auto flex items-center gap-2 bg-muted/50 justify-end rounded-t-lg p-2 print-hide">
                {selectedOrder.paid && (
                    <Button size="icon" variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4"/>
                        <span className="sr-only">Print Receipt</span>
                    </Button>
                )}
                <Button size="icon" variant="outline" className="h-10 w-10" onClick={onClose}>
                    <X className="h-4 w-4"/>
                    <span className="sr-only">Close</span>
                </Button>
            </div>
            <Card className="overflow-hidden rounded-t-none border-t-0" ref={componentRef}>
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            Order {selectedOrder.id}
                            <Button size="icon" variant="outline"
                                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 print-hide">
                                <Copy className="h-3 w-3"/>
                                <span className="sr-only">Copy Order ID</span>
                            </Button>
                        </CardTitle>
                        <CardDescription>Date: {formatDate(selectedOrder.createdAt)}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <div className="font-semibold">Order Details</div>
                        {orderItem?.orderItems.length === 0 && (
                            <p className='bg-muted/50 p-2 text-destructive/80 font-quicksand rounded-lg'>No Food
                                ordered</p>
                        )}
                        {orderItem?.orderItems.map((item) => (
                            <div key={item.id} className="border p-4 rounded mb-4">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Food ordered</p>
                                    <p className="">{item.foodMenu.name}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Price</p>
                                    <p>{CURRENCY}{formatCurrency(item.price)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Quantity</p>
                                    <p>{item.quantity}</p>
                                </div>
                            </div>
                        ))}
                        <Separator className="my-2"/>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{CURRENCY}{formatCurrency(subtotal)}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>{CURRENCY}0.00</span>
                            </li>
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground">Total</span>
                                <span>{CURRENCY}{formatCurrency(subtotal)}</span>
                            </li>
                        </ul>
                    </div>
                    <Separator className="my-4"/>
                    <div className="grid grid-cols-2 gap-[12rem]">
                        <div className="grid gap-3">
                            <div className="font-semibold">Order Address</div>
                            <address className="grid gap-0.5 not-italic text-muted-foreground">
                                <span>{selectedOrder.name}</span>
                                <span>{selectedOrder.location}</span>
                            </address>
                        </div>
                        <div className="grid auto-rows-max gap-3">
                            <div className="font-semibold">Pick Up Status</div>
                            <div className="text-muted-foreground">
                                {selectedOrder.pickup_status}
                            </div>
                        </div>
                    </div>
                    <Separator className="my-4"/>
                    <div className="grid gap-3">
                        <div className="font-semibold">Customer Information</div>
                        <dl className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Customer</dt>
                                <dd>{selectedOrder.name}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>
                                    <a href="mailto:">{selectedOrder?.email || 'email not added'}</a>
                                </dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Phone</dt>
                                <dd>
                                    <a href="tel:">{selectedOrder.number}</a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <Separator className="my-4"/>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                        Last updated <time dateTime="2023-11-23">{formatDate(selectedOrder.updatedAt)}</time>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
});

OrderDetails.displayName = 'OrderDetails';

export default OrderDetails;
