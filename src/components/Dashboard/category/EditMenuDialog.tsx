import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {createPortal} from 'react-dom';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {MenuData} from "@/hooks/menu/useEditMenu.ts";

const editMenuSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(1, "Price is required"),
    quantity: z.number().min(1, "Quantity is required"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
});

type EditMenuSchema = z.infer<typeof editMenuSchema>;

interface EditMenuDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EditMenuSchema, file?: File) => void;
    initialData?: EditMenuSchema | MenuData | Partial<MenuData>;

}

const CustomEditMenuDialog: React.FC<EditMenuDialogProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onSubmit,
                                                                 initialData,
                                                             }) => {
    const {register, handleSubmit, formState: {errors}, reset} = useForm<EditMenuSchema>({
        resolver: zodResolver(editMenuSchema),
        defaultValues: initialData || {name: '', price: 0, quantity: 0, description: '', imageUrl: ''},
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: EditMenuSchema) => {
        const file = (document.getElementById('image') as HTMLInputElement)?.files?.[0];
        onSubmit(data, file);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50   ">
            <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md  border-muted border-[1px]">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Edit Menu</h2>
                    <p>Edit the menu details.</p>
                </div>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Menu Name"
                                className="mt-1"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </div>
                        <div className='flex flex-row space-x-8'>
                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Price"
                                    className="mt-1"
                                    {...register("price")}
                                />
                                {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="Quantity"
                                    className="mt-1"
                                    {...register("quantity")}
                                />
                                {errors.quantity && <p className="text-sm text-red-600">{errors.quantity.message}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Menu Description"
                                className="mt-1"
                                {...register("description")}
                            />
                            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="image">Upload New Image</Label>
                            <Input
                                id="image"
                                type="file"
                                className="pb-8"
                            />
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

export default CustomEditMenuDialog;
