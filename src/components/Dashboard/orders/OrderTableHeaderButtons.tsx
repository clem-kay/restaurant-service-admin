import React from 'react';
import { Button } from "@/components/ui/button";
import { ListFilter, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface TableHeaderButtonsProps {
    setIsDialogOpen: (isOpen: boolean) => void;
    filter: string;
    onFilterChange: (filter: string) => void;
    statusFilter: string; // Add status filter prop
    onStatusFilterChange: (status: string) => void; // Add status filter change handler prop
}

const OrderTableHeaderButtons: React.FC<TableHeaderButtonsProps> = ({
    setIsDialogOpen,
    filter,
    onFilterChange,
    statusFilter, // Use status filter prop
    onStatusFilterChange // Use status filter change handler prop
}) => (
    <div className="flex justify-end gap-2 p-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filter} onValueChange={onFilterChange}>
                    <DropdownMenuRadioItem value="latest">Latest</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Status</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={onStatusFilterChange}>
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ACCEPTED">Accepted</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="PENDING">Pending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="COOKING">Cooking</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="COMPLETED">Completed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="CANCELLED">Cancelled</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Order</span>
        </Button>
    </div>
);

export default OrderTableHeaderButtons;
