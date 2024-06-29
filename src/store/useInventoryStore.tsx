import { create } from 'zustand';
import { CategoryResponse } from "@/hooks/category/useCategory.tsx";
import { MenuResponse } from "@/hooks/menu/useMenu.tsx";

interface InventoryStore {
    categories: CategoryResponse[];
    menu: MenuResponse[];
    setCategories: (categories: CategoryResponse[]) => void;
    setMenu: (menu: MenuResponse[]) => void;
    clearInventory: () => void;
}

const useInventoryStore = create<InventoryStore>((set) => ({
    categories: [],
    menu: [],
    setCategories: (categories: CategoryResponse[]) => set((store) => ({ ...store, categories })),
    setMenu: (menu: MenuResponse[]) => set((store) => ({ ...store, menu })),
    clearInventory: () => set(() => ({
        categories: [],
        menu: [],
    })),
}));

export default useInventoryStore;
