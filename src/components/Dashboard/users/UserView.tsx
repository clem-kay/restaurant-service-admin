import React, { useEffect   } from 'react';
import useUserAccounts from "@/hooks/userAccount/useUserAccounts.ts";
import useUserAccountsStore from "@/store/useUserAccountsStore.ts";
import UserAccountsTable from "@/components/Dashboard/users/UserAccountsTable.tsx";

const UserView: React.FC = () => {
    const { data: userAccounts, isFetched } = useUserAccounts();
    const setUserAccounts = useUserAccountsStore(s => s.setUserAccounts);

    useEffect(() => {
        if (isFetched && userAccounts && userAccounts.length > 0) {
            setUserAccounts(userAccounts);
        }
    }, [isFetched, userAccounts, setUserAccounts]);






    return (
        <div className="flex flex-row p-4 space-x-4">
            <div className="flex-1 transition-all duration-500">
                <UserAccountsTable userAccounts={userAccounts}  />
            </div>
            {/*<div className={`transition-all duration-500 ${selectedOrder ? 'flex-1 animate-fadeIn' : 'hidden'}`}>*/}
            {/*    <div className="sticky top-4">*/}
            {/*        <UserDetails ref={orderDetailsRef} selectedOrder={selectedOrder} onClose={handleCloseDetails} />*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default UserView;
