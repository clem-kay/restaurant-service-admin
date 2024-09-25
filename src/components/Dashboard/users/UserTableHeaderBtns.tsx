import React from 'react';
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";

interface TableHeaderButtonsProps {
    setIsDialogOpen: () => void;
}

const UserTableHeaderBtns: React.FC<TableHeaderButtonsProps> = ({
                                                                    setIsDialogOpen,
                                                                }) => (
    <div className="flex justify-end gap-2 p-2">
        <Button size="sm" className="h-8 gap-1" onClick={setIsDialogOpen}>
            <PlusCircle className="h-3.5 w-3.5"/>
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Register User</span>
        </Button>
    </div>
);

export default UserTableHeaderBtns;
