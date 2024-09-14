import {create} from 'zustand';
import {UserAccountResponse} from "@/hooks/userAccount/useUserAccounts.ts";

interface UseUserAccountsStore {
    userAccounts: UserAccountResponse[];
    setUserAccounts: (userAccounts: UserAccountResponse[]) => void;
}

const UseUserAccountsStore = create<UseUserAccountsStore>((set) => ({
    userAccounts: [] as UserAccountResponse[],
    setUserAccounts: (userAccounts: UserAccountResponse[]) => set((store) => ({...store, userAccounts})),
}));

export default UseUserAccountsStore;