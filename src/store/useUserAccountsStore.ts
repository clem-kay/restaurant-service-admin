import {create} from 'zustand';
import {UserAccountResponse} from "@/hooks/userAccount/useUserAccounts.ts";

interface UseUserAccountsStore {
    userAccounts: UserAccountResponse[];
    setUserAccounts: (userAccounts: UserAccountResponse[]) => void;
    updateUserAccountIsActive: (id: number, isActive: boolean) => void;
}

const UseUserAccountsStore = create<UseUserAccountsStore>((set) => ({
    userAccounts: [] as UserAccountResponse[],
    setUserAccounts: (userAccounts: UserAccountResponse[]) => set((store) => ({...store, userAccounts})),
    updateUserAccountIsActive: (id, isActive) => set((store) => ({
        userAccounts: store.userAccounts.map(user =>
            user.id === id ? {...user, isActive} : user
        )
    })),
}));

export default UseUserAccountsStore;