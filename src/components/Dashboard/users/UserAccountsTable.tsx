import {useEffect} from 'react';
import {MoreHorizontal} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {TableHeaderContainer} from "@/components/Dashboard/category/TableHeaderContainer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import TableHeaderButtons from "@/components/Dashboard/TableHeaderButtons";
import useUserAccounts from "@/hooks/userAccount/useUserAccounts.ts";
import useUserAccountsStore from "@/store/useUserAccountsStore.ts";

export default function UserAccountTable() {
    const {data: userAccounts} = useUserAccounts();
    const setUserAccounts = useUserAccountsStore(s => s.setUserAccounts)
    const userAccountsFromStore = useUserAccountsStore(s => s.userAccounts)

    useEffect(() => {
        if (userAccounts) {
            setUserAccounts(userAccounts);
        }
    }, [userAccounts, setUserAccounts]);


    const exportToCSV = () => {
        const headers = ["Username", "Created At", "Updated At"];
        const rows = userAccountsFromStore.map(user => [
            user.username,
            user.role,
            user.isActive
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "categories.csv");
        document.body.appendChild(link);

        link.click();
    };


    return (
        <Card className='w-full'>
            <TableHeaderButtons setIsDialogOpen={() => {
            }} onFilterChange={() => {
            }}
                                onExport={exportToCSV}/>
            <CardHeader>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>
                    Manage your Users Accounts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeaderContainer/>
                    <TableBody>
                        {userAccounts && userAccounts.map(({username, role, isActive}, index) => (
                            <TableRow key={index} className='cursor-pointer'>
                                <TableCell className="font-medium">{username}</TableCell>
                                <TableCell className="font-medium">{role}</TableCell>
                                <TableCell><Badge variant="outline">{isActive}</Badge></TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4"/>
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                className='focus:bg-accent'
                                            >
                                                View menu
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='focus:bg-accent' onClick={() => {
                                            }}>Add menu
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='focus:bg-accent' onClick={() => {
                                            }}>Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='hover:bg-destructive'
                                                              onClick={() => {
                                                              }}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            {/*<CreateCategoryDialog*/}
            {/*    isOpen={isDialogOpen}*/}
            {/*    onOpenChange={() => setIsDialogOpen(false)}*/}
            {/*    onSubmit={handleAddCategory}*/}
            {/*/>*/}


            {/*<CustomDialog*/}
            {/*    isOpen={isDeleteDialogOpen}*/}
            {/*    onClose={() => setIsDeleteDialogOpen(false)}*/}
            {/*    onConfirm={confirmDelete}*/}
            {/*    title={'Are you absolutely sure?'}*/}
            {/*    message={'This action cannot be undone. This will permanently delete your category and remove its data from our servers.'}*/}
            {/*    triggerBtnLabel='Delete'*/}
            {/*/>*/}

            {/*<CustomDialog*/}
            {/*    isOpen={isDeleteMenuDialogOpen}*/}
            {/*    onClose={() => setIsDeleteMenuDialogOpen(false)}*/}
            {/*    onConfirm={confirmDeleteMenu}*/}
            {/*    title={'Are you absolutely sure?'}*/}
            {/*    message={'This action cannot be undone. This will permanently delete your menu and remove its data from our servers.'}*/}
            {/*    triggerBtnLabel='Delete'*/}
            {/*/>*/}

        </Card>
    );
}
