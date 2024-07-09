import {TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

export const TableHeaderContainer = () => {
    return (

        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Menu count</TableHead>
                <TableHead className="hidden md:table-cell">Created At</TableHead>
                <TableHead className="hidden md:table-cell">Actions</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
    );
};