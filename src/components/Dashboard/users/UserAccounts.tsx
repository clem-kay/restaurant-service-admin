import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import UserAccountTable from "@/components/Dashboard/users/UserAccountsTable.tsx";
import useUserAccounts from "@/hooks/userAccount/useUserAccounts.ts";
import useUserAccountsStore from "@/store/useUserAccountsStore.ts";


const UserAccountInfoContainer = () => {
    const {data: userAccounts} = useUserAccounts();
    const setUserAccounts = useUserAccountsStore(s => s.setUserAccounts)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (userAccounts) {
            setUserAccounts(userAccounts);
        }
    }, [userAccounts, setUserAccounts]);

    const onSubmit = () => {
        setIsDialogOpen(false);
        //     mutate(data, {
        //         onSuccess: () => {
        //             toast.success("Category created successfully");
        //         },
        //         onError: () => {
        //             toast.error("Failed to create category");
        //         }
        //     });
    };

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-3xl">User Accounts</h1>
            </div>
            <div
                className={`flex flex-1 items-center justify-center rounded-lg ${userAccounts && userAccounts.length > 0 ? '' : 'border border-dashed shadow-sm'}`}
                x-chunk="dashboard-02-chunk-1"
            >
                {userAccounts && userAccounts.length === 0 ? (
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">You have no user accounts</h3>
                        <p className="text-sm text-muted-foreground">
                            You can start displaying as soon as you add a user account.
                        </p>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="mt-4">Register User </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px]">
                                <DialogHeader>
                                    <DialogTitle>Register User Account</DialogTitle>
                                    <DialogDescription>
                                        Register a new user account
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button type="submit">Register</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <UserAccountTable/>
                )}
            </div>
        </>
    );
};

export default UserAccountInfoContainer;
