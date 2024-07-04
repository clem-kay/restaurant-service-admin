import React from 'react';
import {useForm} from 'react-hook-form';
import {Button} from "@/components/ui/button";
import {MenuData} from "@/hooks/menu/useAddMenu.tsx";

interface CreateMenuDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateMenuFormData | MenuData) => void;
}

export interface CreateMenuFormData {
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    userAccountId: number;
    categoryId: number;
}

const CreateMenuDialog: React.FC<CreateMenuDialogProps> = ({isOpen, onClose, onSubmit}) => {
    const {register, handleSubmit, formState: {errors}} = useForm<CreateMenuFormData>();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-60"></div>
            <div className="bg-background border-[1.5px] p-6 rounded-xl shadow-lg z-50 w-full max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">Create New Menu</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            {...register('name', {required: 'Name is required'})}
                            className="w-full p-2 border bg-input rounded"
                        />
                        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            type="number"
                            {...register('price', {required: 'Price is required', valueAsNumber: true})}
                            className="w-full p-2 border rounded bg-input "
                        />
                        {errors.price && <p className="text-destructive-foreground text-sm">{errors.price.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                        <input
                            type="text"
                            {...register('imageUrl')}
                            className="w-full p-2 border rounded bg-input"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Description (optional)</label>
                        <textarea
                            {...register('description')}
                            className="w-full p-2 border rounded bg-input"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" onClick={onClose} variant="outline">
                            Cancel
                        </Button>
                        <Button type="submit" variant="default">
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMenuDialog;