import React, {useEffect, useState} from 'react';
import OrdersTable from '@/components/Dashboard/orders/OrdersTable';
import OrderDetails from "@/components/Dashboard/orders/OrderDetails";
import useOrders, {OrderResponseMany} from "@/hooks/order/useOrders";
import OrderTableHeaderButtons from "@/components/Dashboard/orders/OrderTableHeaderButtons";
import useOrderStore from "@/store/useOrderStore.tsx";

const OrderView: React.FC = () => {
    const {data: ordersData, isFetched} = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseMany | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<OrderResponseMany[]>([]);
    const [_, setIsDialogOpen] = useState(false);
    const setOrders = useOrderStore(s => s.setOrders);

    // Set the first order as the default selected order once the data is fetched
    useEffect(() => {
        if (isFetched && ordersData && ordersData.length > 0) {
            setSelectedOrder(ordersData[0]);
            setOrders(ordersData);
            setFilteredOrders(ordersData);
        }
    }, [isFetched, ordersData]);

    const handleOrderRowClick = (order: OrderResponseMany) => {
        setSelectedOrder(order);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    const handleFilterChange = (filter: string) => {
        const filtered = [...(ordersData || [])];

        if (filter === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }

        setFilteredOrders(filtered);
    };

    return (
        <div className="flex flex-row p-4 space-x-4">
            <div className="flex-1 transition-all duration-500">
                <OrderTableHeaderButtons setIsDialogOpen={setIsDialogOpen} onFilterChange={handleFilterChange}/>
                <OrdersTable orders={filteredOrders} onClickRow={handleOrderRowClick}/>
            </div>
            <div className={`transition-all duration-500 ${selectedOrder ? 'flex-1 animate-fadeIn ' : 'hidden'}`}>
                <OrderDetails selectedOrder={selectedOrder} onClose={handleCloseDetails}/>
            </div>
        </div>
    );
};

export default OrderView;
