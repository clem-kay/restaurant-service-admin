import {create} from 'zustand';
import {CategoryResponse} from "@/hooks/category/useCategory.tsx";
import {MenuResponse} from "@/hooks/menu/useMenu.tsx";

interface User {
    userId: number | null;
    username: string;
}

interface AuthStore {
    token: string;
    refresh_token: string;
    isLoggedIn: boolean;
    user: User;
    categories: CategoryResponse[];
    menu: MenuResponse[];
    setToken: (token: string) => void;
    setRefreshToken: (refresh_token: string) => void;
    setUser: (user: User) => void;
    setCategories: (category: CategoryResponse[]) => void;
    setMenu: (menu: MenuResponse[]) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    clearAuth: () => void;
}


const useAuthStore = create<AuthStore>((set) => ({
    token: '',
    refresh_token: '',
    isLoggedIn: false,
    user: {userId: null, username: ''},
    categories: [],
    menu: [],
    setToken: (token: string) => set((store) => ({...store, token})),
    setRefreshToken: (refresh_token: string) => set((store) => ({...store, refresh_token})),
    setUser: (user: User) => set((store) => ({...store, user})),
    setCategories: (category: CategoryResponse[]) => set((store) => ({...store, category})),
    setMenu: (menu: MenuResponse[]) => set((store) => ({...store, menu})),
    setIsLoggedIn: (isLoggedIn: boolean) => set((store) => ({...store, isLoggedIn})),
    clearAuth: () => set(() => ({
        token: '',
        refresh_token: '',
        isLoggedIn: false,
        user: {userId: null, username: ''},
    })),
}));

export default useAuthStore;
