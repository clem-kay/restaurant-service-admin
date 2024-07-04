import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the schema using zod
const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required")
});

type CreateCategorySchema = z.infer<typeof createCategorySchema>;

interface CreateCategoryDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (data: CreateCategorySchema) => void;
}

const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({isOpen, onOpenChange, onSubmit}) => {
    const {register, handleSubmit, formState: {errors}} = useForm<CreateCategorySchema>({
        resolver: zodResolver(createCategorySchema)
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                    <DialogDescription>
                        Add a new category to organize your menu.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" placeholder="Category" className="col-span-3" {...register("name")} />
                            {errors.name &&
                                <p className="col-span-4 text-xs text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" className="col-span-3"
                                      placeholder="Category description" {...register("description")} />
                            {errors.description &&
                                <p className="col-span-4 text-xs text-destructive">{errors.description.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryDialog;
