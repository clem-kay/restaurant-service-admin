import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

interface TableHeaderButtonsProps {
    setIsDialogOpen: (role?: 'RESTAURANT_STAFF' | 'RESTAURANT_ADMIN') => void;
}

const UserTableHeaderBtns: React.FC<TableHeaderButtonsProps> = ({ setIsDialogOpen }) => {
    const role = useAuthStore((s) => s.user?.role);
    const isRestaurantAdmin = role === 'RESTAURANT_ADMIN';

    if (isRestaurantAdmin) {
        return (
            <div className="flex justify-end gap-2 p-2">
                <Button size="sm" className="h-8 gap-1" variant="outline" onClick={() => setIsDialogOpen('RESTAURANT_ADMIN')}>
                    <UserPlus className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Co-Admin</span>
                </Button>
                <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen('RESTAURANT_STAFF')}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Staff</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex justify-end gap-2 p-2">
            <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen()}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Register User</span>
            </Button>
        </div>
    );
};

export default UserTableHeaderBtns;
