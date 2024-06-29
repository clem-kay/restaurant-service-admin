import { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import useAddCategory from "@/hooks/category/useAddCategory.tsx";
import useCategory from "@/hooks/category/useCategory.tsx";
import useInventoryStore from "@/store/useInventoryStore.tsx";
import CategoryDataTable from './category/CategoryDataTable';

// Define the schema using zod
const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required")
});

type CreateCategorySchema = z.infer<typeof createCategorySchema>;

const InventoryContainer = () => {
    const { mutate } = useAddCategory();
    const { data: categoryData } = useCategory();
    const setCategories = useInventoryStore((state) => state.setCategories);
    const categories = useInventoryStore((state) => state.categories);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CreateCategorySchema>({
        resolver: zodResolver(createCategorySchema)
    });

    useEffect(() => {
        if (categoryData) {
            setCategories(categoryData);
        }
    }, [categoryData, setCategories]);

    const onSubmit = (data: CreateCategorySchema) => {
        setIsDialogOpen(false);
        mutate(data, {
            onSuccess: () => {
                toast.success("Category created successfully");
            },
            onError: () => {
                toast.error("Failed to create category");
            }
        });
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
            </div>
            <div
                className={`flex flex-1 items-center justify-center rounded-lg ${categories && categories.length > 0 ? '' : 'border border-dashed shadow-sm'}`}
                x-chunk="dashboard-02-chunk-1"
            >
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">You have no categories</h3>
                        <p className="text-sm text-muted-foreground">
                            You can start displaying as soon as you add a category.
                        </p>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="mt-4">Add Category</Button>
                            </DialogTrigger>
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
                                            <Input
                                                id="name"
                                                placeholder="Category"
                                                className="col-span-3"
                                                {...register("name")}
                                            />
                                            {errors.name && <p className="col-span-4 text-xs text-destructive">{errors.name.message}</p>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="description" className="text-right">Description</Label>
                                            <Textarea
                                                id="description"
                                                className="col-span-3"
                                                placeholder="Category description"
                                                {...register("description")}
                                            />
                                            {errors.description && <p className="col-span-4 text-xs text-destructive">{errors.description.message}</p>}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Create</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <CategoryDataTable />
                )}
            </div>
        </main>
    );
};

export default InventoryContainer;
