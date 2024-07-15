import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ListFilter, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface TableHeaderButtonsProps {
    setIsDialogOpen: (isOpen: boolean) => void;
    onFilterChange: (filter: string) => void;
}

const OrderTableHeaderButtons: React.FC<TableHeaderButtonsProps> = ({ setIsDialogOpen, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['name']);

    const handleFilterChange = (filter: string) => {
        const updatedFilters = selectedFilters.includes(filter)
            ? selectedFilters.filter((item) => item !== filter)
            : [...selectedFilters, filter];
        setSelectedFilters(updatedFilters);
        onFilterChange(filter);
    };

    return (
        <div className="flex justify-end gap-2 p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuCheckboxItem checked={selectedFilters.includes('name')} onCheckedChange={() => handleFilterChange('name')}>
                        Name
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={selectedFilters.includes('oldest')} onCheckedChange={() => handleFilterChange('oldest')}>
                        Oldest
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5"/>
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Order</span>
            </Button>
        </div>
    );
};

export default OrderTableHeaderButtons;
