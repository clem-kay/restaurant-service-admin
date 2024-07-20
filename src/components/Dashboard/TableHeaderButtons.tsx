import React from 'react';
import {Button} from "@/components/ui/button";
import {File, ListFilter, PlusCircle} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface TableHeaderButtonsProps {
    setIsDialogOpen: (isOpen: boolean) => void;
    onFilterChange: (filter: string) => void;
    onExport: () => void;
}

const TableHeaderButtons: React.FC<TableHeaderButtonsProps> = ({setIsDialogOpen, onFilterChange, onExport}) => (
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
                <DropdownMenuRadioGroup onValueChange={onFilterChange}>
                    <DropdownMenuRadioItem  value="latest">Latest</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={onExport}>
            <File className="h-3.5 w-3.5"/>
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
        </Button>
        <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-3.5 w-3.5"/>
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Category</span>
        </Button>
    </div>
);

export default TableHeaderButtons;
