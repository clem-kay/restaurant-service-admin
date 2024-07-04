import {useEffect, useState} from 'react';
import {File, ListFilter, MoreHorizontal, PlusCircle} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "react-hot-toast";
import useAddCategory, {CategoryData} from "@/hooks/category/useAddCategory.tsx";
import useDeleteCategory from "@/hooks/category/useDeleteCategory.tsx";
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
import CreateCategoryDialog from "@/components/Dashboard/category/CreateCategory";
import DeleteCategoryDialog from "@/components/Dashboard/category/DeleteCategoryDialog"; // Import the custom dialog component

export default function TableBodyContainer() {
    const {data: categoryData} = UseCategory();
    const categories = useInventoryStore((state) => state.categories);
    const {mutate: addCategory} = useAddCategory();
    const {mutate: deleteCategory} = useDeleteCategory();
    const setCategories = useInventoryStore((state) => state.setCategories);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (categoryData) {
            setCategories(categoryData);
        }
    }, [categoryData, setCategories]);

    const handleAddCategory = (data: CategoryData) => {
        setIsDialogOpen(false);
        addCategory(data, {
            onSuccess: () => {
                toast.success("Category created successfully");
            },
            onError: () => {
                toast.error("Failed to create category");
            }
        });
    };

    const handleDelete = (id: number | null) => {
        setSelectedCategory(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedCategory !== null) {
            deleteCategory(selectedCategory, {
                onSuccess: () => {
                    toast.success("Category deleted successfully");
                    setIsDeleteDialogOpen(false);
                    setSelectedCategory(null);
                },
                onError: () => {
                    toast.error("Failed to delete category");
                    setIsDeleteDialogOpen(false);
                    setSelectedCategory(null);
                }
            });
        }
    };

    return (
        <Card>
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
                        {categories?.map(({id, name, createdAt, updatedAt}) => (
                            <TableRow key={id}>
                                <TableCell className="font-medium">{name}</TableCell>
                                <TableCell><Badge variant="outline">Draft</Badge></TableCell>
                                <TableCell className="hidden md:table-cell">$499.99</TableCell>
                                <TableCell className="hidden md:table-cell">25</TableCell>
                                <TableCell className="hidden md:table-cell">10</TableCell>
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
                                            <DropdownMenuItem className='focus:bg-accent'>Add Menu</DropdownMenuItem>
                                            <DropdownMenuItem className='focus:bg-accent'>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className='hover:bg-destructive'
                                                              onClick={() => handleDelete(id)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                {/*<div className="text-xs text-muted-foreground">*/}
                {/*    Showing <strong>1-10</strong> of <strong>32</strong> Categories*/}
                {/*</div>*/}
            </CardFooter>

            <CreateCategoryDialog
                isOpen={isDialogOpen}
                onOpenChange={() => setIsDialogOpen(false)}
                onSubmit={handleAddCategory}
            />

            <DeleteCategoryDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
            />
        </Card>
    );
}

const TableHeaderButtons = ({setIsDialogOpen}: { setIsDialogOpen: (isOpen: boolean) => void }) => {
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
