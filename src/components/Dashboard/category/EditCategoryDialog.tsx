// CustomEditCategoryDialog.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const editCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
});

type EditCategorySchema = z.infer<typeof editCategorySchema>;

interface EditCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EditCategorySchema) => void;
    initialData?: EditCategorySchema;
}

const CustomEditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
                                                                         isOpen,
                                                                         onClose,
                                                                         onSubmit,
                                                                         initialData,
                                                                     }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<EditCategorySchema>({
        resolver: zodResolver(editCategorySchema),
        defaultValues: initialData || { name: '', description: '' },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: EditCategorySchema) => {
        onSubmit(data);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md border-muted border-[1px]">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Edit Category</h2>
                    <p>Edit the category details.</p>
                </div>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Category"
                                className="mt-1"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Category description"
                                className="mt-1"
                                {...register("description")}
                            />
                            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <Button type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CustomEditCategoryDialog;
