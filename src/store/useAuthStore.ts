import { create } from 'zustand';
import { CategoryResponse } from "@/hooks/category/useCategory.tsx";
import { MenuResponse } from "@/hooks/menu/useMenu.tsx";

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
    token: localStorage.getItem('token') || '',
    refresh_token: localStorage.getItem('refresh_token') || '',
    isLoggedIn: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || '{"userId": null, "username": ""}'),
    categories: [],
    menu: [],
    setToken: (token: string) => {
        localStorage.setItem('token', token);
        set((store) => ({ ...store, token }));
    },
    setRefreshToken: (refresh_token: string) => {
        localStorage.setItem('refresh_token', refresh_token);
        set((store) => ({ ...store, refresh_token }));
    },
    setUser: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        set((store) => ({ ...store, user }));
    },
    setCategories: (categories: CategoryResponse[]) => set((store) => ({ ...store, categories })),
    setMenu: (menu: MenuResponse[]) => set((store) => ({ ...store, menu })),
    setIsLoggedIn: (isLoggedIn: boolean) => set((store) => ({ ...store, isLoggedIn })),
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        set(() => ({
            token: '',
            refresh_token: '',
            isLoggedIn: false,
            user: { userId: null, username: '' },
            categories: [],
            menu: [],
        }));
    },
}));

export default useAuthStore;
