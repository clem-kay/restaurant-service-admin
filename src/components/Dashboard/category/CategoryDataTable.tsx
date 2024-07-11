import {format} from 'date-fns';
import {useEffect, useState} from 'react';
import {File, ListFilter, MoreHorizontal, PlusCircle} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "react-hot-toast";
import useAddCategory, {CategoryData} from "@/hooks/category/useAddCategory.tsx";
import useDeleteCategory from "@/hooks/category/useDeleteCategory.tsx";
import useInventoryStore from "@/store/useInventoryStore.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
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
import CreateMenuDialog, {CreateMenuFormData} from "@/components/Dashboard/category/CreateMenuDialog";
import CustomDialog from "@/components/Dashboard/category/CustomDialog.tsx";
import CreateCategoryDialog from "@/components/Dashboard/category/CreateCategoryDialog.tsx";
import useAddMenu, {MenuData} from "@/hooks/menu/useAddMenu.tsx";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import useAddMenuImage, {ImageResponse} from "@/hooks/menu/useAddMenuImage.tsx";
import useAuthStore from "@/store/useAuthStore.ts";
import {handleError} from "@/utils/utils.ts";
import UseMenu, {MenuResponse} from "@/hooks/menu/useMenu.tsx";
import UseCategory from "@/hooks/category/useCategory.tsx";

export default function TableBodyContainer() {
    const {data: categoryData} = UseCategory();
    const categories = useInventoryStore((state) => state.categories);
    const {data: menuData} = UseMenu();
    const userAccountId = useAuthStore(s => s.user.userId);
    const setMenu = useInventoryStore(s => s.setMenu);
    const menu = useInventoryStore(s => s.menu);
    const {mutate: addCategory} = useAddCategory();
    const {mutate: deleteCategory} = useDeleteCategory();
    const {mutate: addMenuUrl} = useAddMenuImage();
    const {mutate: addMenu} = useAddMenu();
    const setCategories = useInventoryStore((state) => state.setCategories);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateMenuDialogOpen, setIsCreateMenuDialogOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<MenuResponse[]>([]);

    useEffect(() => {
        if (categoryData) {
            setCategories(categoryData);
        }
    }, [categoryData, setCategories]);

    useEffect(() => {
        if (menuData) {
            setMenu(menuData);
        }
    }, [menuData, setMenu, menu]);

    useEffect(() => {
        if (selectedCategory !== null) {
            setMenu(menu)
        }
    }, [selectedCategory, setMenu, menu]);

    useEffect(() => {
        if (selectedCategory !== null) {
            const findMenuByCategoryId = menu.filter(menu => menu.categoryId === selectedCategory);
            setSelectedMenu(findMenuByCategoryId);
        }
    }, [selectedCategory, menu]);

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

    const handleCreateMenu = (data: CreateMenuFormData) => {
        const {name, price, imageUrl, description} = data;
        const menuData: MenuData = {
            name,
            price,
            description,
            userAccountId,
            categoryId: selectedCategory // Ensure selectedCategory is used
        };

        if (imageUrl && imageUrl[0]) {
            const formData = new FormData();
            formData.append('file', imageUrl[0]); // Assuming imageUrl is a FileList

            // Debugging log to check FormData contents
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            addMenuUrl(formData, {
                onSuccess: (uploadedImageUrl: ImageResponse) => {
                    addMenu({...menuData, imageUrl: uploadedImageUrl.url}, {
                        onSuccess: (newMenu) => {
                            toast.success("Menu created successfully");
                            const updatedMenu = [...menu, newMenu];
                            setMenu(updatedMenu);
                            setCategories(categories.map(category =>
                                category.id === selectedCategory ? {
                                    ...category,
                                    menuCount: category.menuCount + 1
                                } : category
                            ));
                            setIsCreateMenuDialogOpen(false); // Close the dialog
                            // Update the selected menu list
                            setSelectedMenu(updatedMenu.filter(menu => menu.categoryId === selectedCategory));
                        },
                        onError: (e) => {
                            handleError(e);
                        }
                    });
                },
                onError: () => {
                    toast.error("Failed to add menu image");
                }
            });
        } else {
            addMenu(menuData, {
                onSuccess: (newMenu) => {
                    toast.success("Menu created successfully");
                    const updatedMenu = [...menu, newMenu];
                    setMenu(updatedMenu);
                    setCategories(categories.map(category =>
                        category.id === selectedCategory ? {...category, menuCount: category.menuCount + 1} : category
                    ));
                    setIsCreateMenuDialogOpen(false); // Close the dialog
                    // Update the selected menu list
                    setSelectedMenu(updatedMenu.filter(menu => menu.categoryId === selectedCategory));
                },
                onError: (e) => {
                    handleError(e);
                }
            });
        }
    };

    const handleRowClick = (id: number | null) => {
        setSelectedCategory(id);
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedCategory(null);
        setSelectedMenu([]);
    };

    return (
        <Card>
            <TableHeaderButtons setIsDialogOpen={setIsDialogOpen}
            />
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
                        {categories?.map(({id, name, menuCount, createdAt, updatedAt}) => (
                            <TableRow key={id} onClick={() => handleRowClick(id)} className='cursor-pointer'>
                                <TableCell className="font-medium">{name}</TableCell>
                                <TableCell><Badge variant="outline">Draft</Badge></TableCell>
                                <TableCell className="hidden md:table-cell">{menuCount || 0}</TableCell>
                                <TableCell
                                    className="hidden md:table-cell">{updatedAt ? format(new Date(updatedAt), 'MMMM dd, yyyy HH:mm:ss') : format(new Date(createdAt as string), 'MMMM dd, yyyy HH:mm:ss')}</TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4"/>
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className='focus:bg-accent'
                                            >
                                                View menu</DropdownMenuItem>
                                            <DropdownMenuItem className='focus:bg-accent'
                                                              onClick={() => {
                                                                  setSelectedCategory(id)
                                                                  setIsCreateMenuDialogOpen(true)
                                                              }}>Add
                                                menu</DropdownMenuItem>
                                            <DropdownMenuItem className='focus:bg-accent'>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className='hover:bg-destructive'
                                                              onClick={() => handleDelete(id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <CreateCategoryDialog
                isOpen={isDialogOpen}
                onOpenChange={() =>
                    setIsDialogOpen(false)}
                onSubmit={handleAddCategory}
            />

            <CustomDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={'Are you absolutely sure?'}
                message={'This action cannot be undone. This will permanently delete your category and remove its data from our servers.'}
                triggerBtnLabel='Delete'
            />

            <CreateMenuDialog
                isOpen={isCreateMenuDialogOpen}
                onClose={() => setIsCreateMenuDialogOpen(false)}
                onSubmit={handleCreateMenu}
            />

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader className='flex flex-row justify-between'>
                        <div>
                            <DrawerTitle>Menu for
                                Category {(categories && categories?.find(c => c.id === selectedCategory)?.name)}</DrawerTitle>
                            <DrawerDescription>Details of the selected category's menu items.</DrawerDescription>
                        </div>
                        <div className='pr-[6rem]'>
                            <Button onClick={handleDrawerClose}>Close</Button>
                        </div>
                    </DrawerHeader>
                    <div className="flex flex-col overflow-auto max-h-[65vh] p-4 pb-0">
                        {selectedMenu && selectedMenu.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="hidden md:table-cell">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedMenu.map((menu) => (
                                        <TableRow key={menu.id}>
                                            <TableCell className="hidden sm:table-cell">
                                                <img
                                                    alt="Menu image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src={menu.imageUrl as string}
                                                    width="64"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{menu.name}</TableCell>
                                            <TableCell>{menu.price}</TableCell>
                                            <TableCell>{menu.description}</TableCell>
                                            <TableCell>{format(new Date(menu.createdAt), 'MMMM dd, yyyy HH:mm:ss')}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4"/>
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            className='hover:bg-accent'>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className='hover:bg-destructive/90'>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>No menu items found for this category.</p>
                        )}
                    </div>
                    <DrawerFooter></DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Card>
    );
}

const TableHeaderButtons = ({setIsDialogOpen,}: {
    setIsDialogOpen: (isOpen: boolean) => void,
}) => {
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
