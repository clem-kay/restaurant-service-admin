import React, {useEffect, useState} from 'react';
import {File, ListFilter, MoreHorizontal, PlusCircle} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {toast} from "react-hot-toast";
import useAddCategory from "@/hooks/category/useAddCategory.tsx";
import UseCategory from "@/hooks/category/useCategory.tsx";
import useInventoryStore from "@/store/useInventoryStore.tsx";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import {TableHeaderContainer} from "@/components/Dashboard/category/TableHeaderContainer.tsx";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

// Define the schema using zod
const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required")
});

type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export default function TableBodyContainer() {
    const {data: categoryData} = UseCategory();
    const categories = useInventoryStore((state) => state.categories);
    const {mutate} = useAddCategory();
    const setCategories = useInventoryStore((state) => state.setCategories);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm<CreateCategorySchema>({
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
        <Card className=''>
            <TableHeaderButtons setIsDialogOpen={setIsDialogOpen}/>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                    Manage your Categories and view their sales performance.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeaderContainer/>
                    <TableBody>
                        {categories?.map(({name, createdAt, updatedAt}) => (
                            <TableRow key={name}>
                                <TableCell className="font-medium">{name}</TableCell>
                                <TableCell><Badge variant="outline">Draft</Badge></TableCell>
                                <TableCell className="hidden md:table-cell">$499.99</TableCell>
                                <TableCell className="hidden md:table-cell">25</TableCell>
                                <TableCell
                                    className="hidden md:table-cell">{updatedAt ? updatedAt : createdAt}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4"/>
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong> Categories
                </div>
            </CardFooter>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                <Label htmlFor="name" className="text-right">name</Label>
                                <Input id="name" placeholder="Category" className="col-span-3" {...register("name")} />
                                {errors.name &&
                                    <p className="col-span-4 text-xs text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">description</Label>
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
        </Card>
    );
}

const TableHeaderButtons = ({setIsDialogOpen}: { setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

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
                    <DropdownMenuCheckboxItem checked>name</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>latest</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>oldest</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-8 gap-1">
                <File className="h-3.5 w-3.5"/>
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
            <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5"/>
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Category</span>
            </Button>
        </div>
    );
}
