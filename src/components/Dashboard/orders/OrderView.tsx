import React, { useEffect, useRef, useState } from 'react';
import OrdersTable from '@/components/Dashboard/orders/OrdersTable';
import OrderDetails from "@/components/Dashboard/orders/OrderDetails";
import useOrders, { OrderResponseMany } from "@/hooks/order/useOrders";
import OrderTableHeaderButtons from "@/components/Dashboard/orders/OrderTableHeaderButtons";
import useOrderStore from "@/store/useOrderStore";
import CreateOrderDialog from '@/components/Dashboard/orders/CreateOrderDialog';

const OrderView: React.FC = () => {
    const { data: ordersData, isFetched } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseMany | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<OrderResponseMany[]>([]);
    const [filter, setFilter] = useState<string>('latest');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const setOrders = useOrderStore(s => s.setOrders);
    const orderDetailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isFetched && ordersData && ordersData.length > 0) {
            setSelectedOrder(ordersData[0]);
            setOrders(ordersData);
            setFilteredOrders(ordersData);
        }
    }, [isFetched, ordersData, setOrders]);

    const handleOrderRowClick = (order: OrderResponseMany) => {
        setSelectedOrder(order);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    const handleFilterChange = (filter: string) => {
        setFilter(filter);
        const filtered = [...(ordersData || [])];

        if (filter === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else if (filter === 'latest') {
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (filter === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredOrders(filtered);
    };

    return (
        <div className="flex flex-row p-4 space-x-4">
            <div className="flex-1 transition-all duration-500">
                <OrderTableHeaderButtons setIsDialogOpen={setIsDialogOpen} filter={filter} onFilterChange={handleFilterChange} />
                <OrdersTable orders={filteredOrders} onClickRow={handleOrderRowClick} />
            </div>
            <div className={`transition-all duration-500 ${selectedOrder ? 'flex-1 animate-fadeIn' : 'hidden'}`}>
                <div className="sticky top-4">
                    <OrderDetails ref={orderDetailsRef} selectedOrder={selectedOrder} onClose={handleCloseDetails} />
                </div>
            </div>
            <CreateOrderDialog isOpen={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)} />
        </div>
    );
};

export default OrderView;
