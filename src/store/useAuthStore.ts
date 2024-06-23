import { create } from 'zustand';

interface User {
    userId: number | null;
    username: string;
}

interface AuthStore {
    token: string;
    refresh_token: string;
    isLoggedIn: boolean;
    user: User;
    setToken: (token: string) => void;
    setRefreshToken: (refresh_token: string) => void;
    setUser: (user: User) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: '',
    refresh_token: '',
    isLoggedIn: false,
    user: { userId: null, username: '' },
    setToken: (token: string) => set((store) => ({ ...store, token })),
    setRefreshToken: (refresh_token: string) => set((store) => ({ ...store, refresh_token })),
    setUser: (user: User) => set((store) => ({ ...store, user })),
    setIsLoggedIn: (isLoggedIn: boolean) => set((store) => ({ ...store, isLoggedIn })),
    clearAuth: () => set(() => ({
        token: '',
        refresh_token: '',
        isLoggedIn: false,
        user: { userId: null, username: '' },
    })),
}));

export default useAuthStore;
