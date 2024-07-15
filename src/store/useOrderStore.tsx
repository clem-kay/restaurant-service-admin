import {create} from 'zustand';
import {OrderResponseMany} from "@/hooks/order/useOrders.ts";

interface UseOrderStore {
    orders: OrderResponseMany[]
    setOrders: (orders: OrderResponseMany[]) => void;
}

const useOrderStore = create<UseOrderStore>((set) => ({
    orders: [],
    setOrders: (orders: OrderResponseMany[]) => set((store) => ({...store, orders})),
}));

export default useOrderStore;
