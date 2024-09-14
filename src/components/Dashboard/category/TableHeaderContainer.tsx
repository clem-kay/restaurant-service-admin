import {TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useLocation} from "react-router-dom";

export const TableHeaderContainer = () => {
    const path = useLocation().pathname.split("/")[3];

    return (

        <TableHeader>
            {
                path !== "users" ? (
                    <>

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
                    </>
                ) : (
                    <>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="hidden md:table-cell">Actions</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </>
                )
            }
        </TableHeader>
    );
};