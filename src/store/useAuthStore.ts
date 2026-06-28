import { create } from 'zustand';
import { ROLE } from '@/constants/constants';

interface User {
    userId: number | null;
    username: string;
    role?: ROLE;
}

interface AuthStore {
    token: string;
    refresh_token: string;
    isLoggedIn: boolean;
    isRegisterUser: boolean;
    user: User;
    setToken: (token: string) => void;
    setRefreshToken: (refresh_token: string) => void;
    setIsRegisterUser: (state: boolean) => void;
    setUser: (user: User) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    token: localStorage.getItem('token') || '',
    refresh_token: localStorage.getItem('refresh_token') || '',
    isLoggedIn: !!localStorage.getItem('token'),
    isRegisterUser: false,
    user: JSON.parse(localStorage.getItem('user') || '{"userId": null, "username": ""}'),
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },
    setRefreshToken: (refresh_token) => {
        localStorage.setItem('refresh_token', refresh_token);
        set({ refresh_token });
    },
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    setIsRegisterUser: (isRegisterUser) => set({ isRegisterUser }),
    setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        set({
            token: '',
            refresh_token: '',
            isLoggedIn: false,
            user: { userId: null, username: '' },
        });
    },
}));

export default useAuthStore;
