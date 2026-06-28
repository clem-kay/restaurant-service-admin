import useCustomers from "@/hooks/customers/useCustomers";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const CustomersPage = () => {
    const { data: customers, isLoading, isError } = useCustomers();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Customers</h1>
                <span className="text-sm text-muted-foreground">{customers?.length ?? 0} total</span>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading customers...</div>
            ) : isError ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    Failed to load customers.
                </div>
            ) : !customers || customers.length === 0 ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center text-muted-foreground">No customers registered yet.</div>
                </div>
            ) : (
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Addresses</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="text-sm text-muted-foreground">{customer.id}</TableCell>
                                    <TableCell className="font-medium">
                                        {customer.firstName} {customer.lastName}
                                    </TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {customer.account?.username ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {customer.account?.profile?.email ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {customer.addresses?.length ?? 0}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </main>
    );
};

export default CustomersPage;
