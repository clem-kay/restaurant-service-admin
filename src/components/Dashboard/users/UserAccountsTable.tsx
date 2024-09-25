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
import useResetUserPassword from "@/hooks/userAccount/useResetUserPassword.ts";

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
    const [accountId, setAccountId] = useState<number | null>(null)
    const setIsRegisterUser = useAuthStore((state) => state.setIsRegisterUser);
    const userRole = useAuthStore((state) => state.user.role);
    const navigate = useNavigate();
    const {mutate: updateUserAccount} = useActivateUserAccount();
    const {mutate: deleteUserAccount} = useDeleteUserAccount();
    // const {mutate: resetPassword} = useResetUserPassword();

    const userAccountsPerPage = 10;

    // Pagination
    const indexOfLastUserAccount = currentPage * userAccountsPerPage;
    const indexOfFirstUserAccount = indexOfLastUserAccount - userAccountsPerPage;
    const currentUserAccounts = userAccounts?.slice(indexOfFirstUserAccount, indexOfLastUserAccount);

    let userAccountLength = 0
    if (userAccounts) {
        userAccountLength = userAccounts.length

    }
    const handleRegister = () => {
        setIsDialogOpen(false);
        setIsRegisterUser(true)
        navigate('/auth/register')
    }

    const handleDeleteUser = (id: number) => {
        deleteUserAccount(id)
    }

    const handleResetPassword = (id: number) => {

    }

    const handleisActive = (id: number, data: boolean) => {
        updateUserAccount({id, data})

    }
    const totalPages = Math.ceil(userAccountLength / userAccountsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <>

            <CustomDialog
                title='Delete User Account?'
                message='Are you sure? This operation cannot be undone'
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleRegister}
                triggerBtnLabel={'Confirm'}
            />


            <CustomDialog
                title='Register a new User Account?'
                message='You will be redirected to the register page'
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleRegister}
                triggerBtnLabel={'Confirm'}
            />
            <Card className='flex-grow'>
                <CardHeader className="px-7">
                    <CardTitle>User Accounts</CardTitle>
                    <CardDescription>Check out all your user accounts.</CardDescription>
                    {userRole === "SUPERADMIN" && <UserTableHeaderBtns setIsDialogOpen={setIsDialogOpen}/>}
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
                                        <TableRow
                                            className={`cursor-pointer`}
                                            key={index}
                                        >
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
                                            <TableCell className="hidden sm:table-cell"
                                                       onClick={(e) => e.stopPropagation()}>
                                                <div className='inline-flex'>
                                                    <Badge className="text-xs "
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
                                                        <DropdownMenuItem className='hover:bg-accent' onClick={() => {
                                                            setIsDialogOpen(true)
                                                            // updateUserAccount({id: user.id, isActive: true})
                                                        }}>Activate</DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className='hover:bg-destructive/90'
                                                            onClick={() => {
                                                                setIsDialogOpen(true)
                                                                // updateUserAccount({id: user.id, isActive: false})
                                                            }}
                                                        >Deactivate
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className='hover:bg-destructive/90'
                                                            onClick={() => {
                                                                setIsDialogOpen(true)
                                                                // deleteUserAccount(user.id)
                                                            }}
                                                        >Delete
                                                        </DropdownMenuItem>


                                                        <DropdownMenuItem
                                                            className='hover:bg-destructive/90'
                                                            onClick={() => {
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
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={indexOfLastUserAccount >= userAccounts.length}
                                    >
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
