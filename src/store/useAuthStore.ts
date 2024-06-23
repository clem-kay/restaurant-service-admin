import {create} from 'zustand'

interface AuthStore {
    token: string;
    refresh_token: string;
    isLoggedIn: boolean;
    user: User;
    setToken: (token: string) => void;
    setRefreshToken: (refresh_token: string) => void;
    setUserName: (username: string) => void;
    setUserId: (userId: number) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

interface User {
    userId: number | null;
    username: string;
}

const useAuthStore = create<AuthStore>((set) => (
    {
        token: '',
        refresh_token: '',
        isLoggedIn: false,
        user: {userId: null, username: ''},
        setUserName: (username: string) => set((store) => ({user: {...store.user, username}})),
        setUserId: (userId: number | null) => set((store) => ({user: {...store.user, userId}})),
        setIsLoggedIn: (isLoggedIn: boolean) => set((store) => ( {...store, isLoggedIn})),
        setToken: (token: string) => set((store) => ({...store, token})),
        setRefreshToken: (refresh_token: string) => set((store) => ({...store, refresh_token})),
    }
))


export default useAuthStore;