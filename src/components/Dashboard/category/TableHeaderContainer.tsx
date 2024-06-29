import {TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

export const TableHeaderContainer = () => {
    return (

        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                    Total Sales
                </TableHead>
                <TableHead className="hidden md:table-cell">{}</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
    );
};