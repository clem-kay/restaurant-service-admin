import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from '@/components/ui/button';
import {UserAccountResponse} from "@/hooks/userAccount/useUserAccounts.ts";
import {MoreHorizontal} from "lucide-react";
import UserTableHeaderBtns from "@/components/Dashboard/users/UserTableHeaderBtns.tsx";
import CustomDialog from "@/components/Dashboard/category/CustomDialog.tsx";
import useAuthStore from "@/store/useAuthStore.ts";
import useActivateUserAccount from "@/hooks/userAccount/useActivateUserAccount.ts";
import useDeleteUserAccount from "@/hooks/userAccount/useDeleteUserAccount.ts";

interface UserAccountsTableProps {
    userAccounts: UserAccountResponse[] | undefined;
}

interface Role {
    SUPERADMIN: 'default';
    ADMIN: 'outline';
    USER: 'orange';
    SALES: 'success';
}

const role: Role = {
    SUPERADMIN: 'default',
    ADMIN: 'outline',
    USER: 'orange',
    SALES: 'success',
};

const getRole = (status: keyof Role): 'default' | 'success' | 'outline' | 'destructive' | 'gray' | 'orange' => {
    return role[status];
};

const UserAccountsTable: React.FC<UserAccountsTableProps> = ({userAccounts}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<null | 'activate' | 'deactivate' | 'delete' | 'resetPassword' | 'register'>(null);
    const [accountId, setAccountId] = useState<number | null>(null);
    const setIsRegisterUser = useAuthStore((state) => state.setIsRegisterUser);
    const userRole = useAuthStore((state) => state.user.role);
    const navigate = useNavigate();
    const {mutate: updateUserAccount} = useActivateUserAccount();
    const {mutate: deleteUserAccount} = useDeleteUserAccount();

    const userAccountsPerPage = 10;
    const indexOfLastUserAccount = currentPage * userAccountsPerPage;
    const indexOfFirstUserAccount = indexOfLastUserAccount - userAccountsPerPage;
    const currentUserAccounts = userAccounts?.slice(indexOfFirstUserAccount, indexOfLastUserAccount);

    let userAccountLength = 0;
    if (userAccounts) {
        userAccountLength = userAccounts.length;
    }

    const handleDialogConfirm = () => {
        if (dialogAction === 'delete' && accountId) {
            deleteUserAccount(accountId);
        } else if (dialogAction === 'activate' && accountId) {
            updateUserAccount({id: accountId, isActiveData: {isActive: true}});
        } else if (dialogAction === 'deactivate' && accountId) {
            updateUserAccount({id: accountId, isActiveData: {isActive: false}});
        } else if (dialogAction === 'resetPassword') {
            navigate('/auth/reset-password')
        } else if (dialogAction === 'register') {
            setIsRegisterUser(true)
            navigate('/auth/register')
        }
        setIsDialogOpen(false);
        setDialogAction(null);
        setAccountId(null);
    };


    const totalPages = Math.ceil(userAccountLength / userAccountsPerPage);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            <CustomDialog
                title={dialogAction === 'delete' ? 'Delete User Account?' :
                    dialogAction === 'activate' ? 'Activate User Account?' :
                        dialogAction === 'deactivate' ? 'Deactivate User Account?' : dialogAction === "resetPassword" ? 'Reset User Password?' : 'Register a new User Account?'}
                message={
                    dialogAction === 'delete' ? 'Are you sure you want to delete this account? This cannot be undone.' :
                        dialogAction === 'activate' ? 'Are you sure you want to activate this account?' :
                            dialogAction === 'deactivate' ? 'Are you sure you want to deactivate this account?' : dialogAction === "resetPassword" ?
                                'Are you sure you want to reset the password for this account?' : 'You will be redirected to the register page'
                }
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleDialogConfirm}
                triggerBtnLabel={'Confirm'}
            />


            <Card className='flex-grow'>
                <CardHeader className="px-7">
                    <CardTitle>User Accounts</CardTitle>
                    <CardDescription>Check out all your user accounts.</CardDescription>
                    {userRole === "SUPERADMIN" && <UserTableHeaderBtns setIsDialogOpen={() => {
                        setDialogAction('register');
                        setIsDialogOpen(true);
                    }}/>}
                </CardHeader>
                <CardContent>
                    {userAccounts && userAccounts.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className=''>
                                        <TableHead>Username</TableHead>
                                        <TableHead className="hidden sm:table-cell">Active</TableHead>
                                        <TableHead className="hidden sm:table-cell">Role</TableHead>
                                        <TableHead className="hidden md:table-cell">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentUserAccounts && currentUserAccounts.map((user, index) => (
                                        <TableRow className="cursor-pointer" key={index}>
                                            <TableCell>
                                                <div className="font-medium">{user.username}</div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className='inline-flex'>
                                                    <Badge className="text-xs"
                                                           variant={user.isActive ? 'success' : 'outline'}>
                                                        {user.isActive ? 'Yes' : 'No'}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className='inline-flex'>
                                                    <Badge className="text-xs"
                                                           variant={getRole(user.role as keyof Role)}>
                                                        {user.role}
                                                    </Badge>
                                                </div>
                                            </TableCell>

                                            <TableCell className="hidden md:table-cell">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4"/>
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className='z-[10000000]'>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator/>
                                                        <DropdownMenuItem
                                                            className='hover:bg-accent'
                                                            onClick={() => {
                                                                setDialogAction('activate');
                                                                setAccountId(user.id);
                                                                setIsDialogOpen(true);
                                                            }}>
                                                            Activate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className='hover:bg-destructive/90'
                                                            onClick={() => {
                                                                setDialogAction('deactivate');
                                                                setAccountId(user.id);
                                                                setIsDialogOpen(true);
                                                            }}>
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className='hover:bg-destructive/90'
                                                            onClick={() => {
                                                                setDialogAction('delete');
                                                                setAccountId(user.id);
                                                                setIsDialogOpen(true);
                                                            }}>
                                                            Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className='hover:bg-destructive/90'
                                                            onClick={() => {
                                                                setDialogAction('resetPassword');
                                                                setAccountId(user.id);
                                                                setIsDialogOpen(true);
                                                            }}>
                                                            Reset Password
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex items-center justify-between space-x-2 py-4">
                                <div>
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}>
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={indexOfLastUserAccount >= userAccounts.length}>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-muted-foreground">You have no user accounts 😓.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default UserAccountsTable;
