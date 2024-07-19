import {create} from 'zustand';
import {OrderResponseMany} from "@/hooks/order/useOrders";

interface UseOrderStore {
    orders: OrderResponseMany[];
    setOrders: (orders: OrderResponseMany[]) => void;
    updateOrder: (id: number, updatedOrder: Partial<OrderResponseMany>) => void;
    userAccountId: number | null;
    setUserAccountId: (userAccountId: number | null) => void;
}

const useOrderStore = create<UseOrderStore>((set) => ({
    orders: [],
    setOrders: (orders: OrderResponseMany[]) => set((store) => ({...store, orders})),
    updateOrder: (id, updatedOrder) => set((store) => ({
        orders: store.orders.map(order =>
            order.id === id ? {...order, ...updatedOrder} : order
        )
    })),
    userAccountId: null,
    setUserAccountId: (userAccountId: number | null) => set((store) => ({...store, userAccountId})),
}));

export default useOrderStore;
