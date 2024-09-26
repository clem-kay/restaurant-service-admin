import React, {useEffect} from 'react';
import useUserAccounts from "@/hooks/userAccount/useUserAccounts.ts";
import useUserAccountsStore from "@/store/useUserAccountsStore.ts";
import UserAccountsTable from "@/components/Dashboard/users/UserAccountsTable.tsx";

const UserView: React.FC = () => {
    const {data: userAccounts, isFetched} = useUserAccounts();
    const setUserAccounts = useUserAccountsStore(s => s.setUserAccounts);
    const userAccountsFromStore = useUserAccountsStore(s => s.userAccounts);

    useEffect(() => {
        if (isFetched && userAccounts && userAccounts.length > 0) {
            setUserAccounts(userAccounts);
        }
    }, [isFetched, userAccounts, userAccountsFromStore, setUserAccounts]);

    useEffect(() => {
        setUserAccounts(userAccountsFromStore);
    }, [userAccountsFromStore, setUserAccounts]);


    return (
        <div className="flex flex-row p-4 space-x-4">
            <div className="flex-1 transition-all duration-500">
                <UserAccountsTable userAccounts={userAccountsFromStore}/>
            </div>
        </div>
    );
};

export default UserView;
