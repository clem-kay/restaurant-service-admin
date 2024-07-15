import React, {useState, useEffect} from 'react';
import OrdersTable from '@/components/Dashboard/orders/OrdersTable';
import OrderDetails from "@/components/Dashboard/orders/OrderDetails.tsx";
import useOrders, {OrderResponseMany} from "@/hooks/order/useOrders.ts";

const OrderView: React.FC = () => {
    const { data: ordersData, isFetched } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseMany | null>(null);

    // Set the first order as the default selected order once the data is fetched
    useEffect(() => {
        if (isFetched && ordersData && ordersData.length > 0) {
            setSelectedOrder(ordersData[0]);
        }
    }, [isFetched, ordersData]);

    const handleOrderRowClick = (order: OrderResponseMany) => {
        setSelectedOrder(order);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="flex flex-row p-4 space-x-4">
            <div className="flex-1 transition-all duration-500">
                <OrdersTable orders={ordersData || []} onClickRow={handleOrderRowClick} />
            </div>
            <div className={`transition-all duration-500 ${selectedOrder ? 'flex-1 animate-fadeIn ' : 'hidden'}`}>
                <OrderDetails selectedOrder={selectedOrder} onClose={handleCloseDetails} />
            </div>
        </div>
    );
};

export default OrderView;
