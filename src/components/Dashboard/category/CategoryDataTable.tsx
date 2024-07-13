import  { ReactNode, useCallback, useEffect, useState } from 'react';
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import useAddCategory, { CategoryData } from "@/hooks/category/useAddCategory";
import useDeleteCategory from "@/hooks/category/useDeleteCategory";
import useInventoryStore from "@/store/useInventoryStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableHeaderContainer } from "@/components/Dashboard/category/TableHeaderContainer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import CreateMenuDialog, { CreateMenuFormData } from "@/components/Dashboard/category/CreateMenuDialog";
import CustomDialog from "@/components/Dashboard/category/CustomDialog";
import CreateOrEditCategoryDialog from "@/components/Dashboard/category/CreateOrEditCategoryDialog";
import useAddMenu, { MenuData } from "@/hooks/menu/useAddMenu";
import useAddMenuImage, { ImageResponse } from "@/hooks/menu/useAddMenuImage";
import useAuthStore from "@/store/useAuthStore";
import { formatDate, handleError } from "@/utils/utils";
import UseMenu, { MenuResponse } from "@/hooks/menu/useMenu";
import UseCategory from "@/hooks/category/useCategory";
import CustomDrawer from '@/components/Dashboard/CustomDrawer';
import useDeleteMenu from '@/hooks/menu/useDeleteMenu';
import TableHeaderButtons from "@/components/Dashboard/TableHeaderButtons";
import UseEditCategory from "@/hooks/category/useEditCategory.ts";

export default function TableBodyContainer() {
    const { data: categoryData } = UseCategory();
    const categories = useInventoryStore((state) => state.categories);
    const { data: menuData } = UseMenu();
    const userAccountId = useAuthStore(s => s.user.userId);
    const setMenu = useInventoryStore(s => s.setMenu);
    const menu = useInventoryStore((state) => state.menu);
    const { mutate: addCategory } = useAddCategory();
    const { mutate: deleteCategory } = useDeleteCategory();
    const { mutate: addMenuUrl } = useAddMenuImage();
    const { mutate: addMenu } = useAddMenu();
    const { mutate: deleteMenu } = useDeleteMenu();
    const { mutate: editCategory } = UseEditCategory();
    const setCategories = useInventoryStore((state) => state.setCategories);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateMenuDialogOpen, setIsCreateMenuDialogOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<MenuResponse[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
    const [isDeleteMenuDialogOpen, setIsDeleteMenuDialogOpen] = useState(false);

    useEffect(() => {
        if (categoryData) {
            setCategories(categoryData);
        }
    }, [categoryData, setCategories]);

    useEffect(() => {
        if (menuData) {
            setMenu(menuData);
        }
    }, [menuData, setMenu]);

    useEffect(() => {
        if (selectedCategory !== null) {
            const findMenuByCategoryId = menu.filter(menu => menu.categoryId === selectedCategory);
            setSelectedMenu(findMenuByCategoryId);
        }
    }, [selectedCategory, menu]);

    const handleAddCategory = useCallback((data: CategoryData) => {
        setIsDialogOpen(false);
        addCategory(data, {
            onSuccess: () => {
                toast.success("Category created successfully");
            },
            onError: () => {
                toast.error("Failed to create category");
            }
        });
    }, [addCategory]);

    const handleEditCategory = useCallback((data: Partial<CategoryData>) => {
        setIsEditDialogOpen(false);
        editCategory({ id: selectedCategory, categoryData: data }, {
            onSuccess: () => {
                toast.success("Category updated successfully");
            },
            onError: () => {
                toast.error("Failed to update category");
            }
        });
    }, [editCategory, selectedCategory]);

    const handleDelete = useCallback((id: number | null) => {
        setSelectedCategory(id);
        setIsDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
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
    }, [selectedCategory, deleteCategory]);

    const handleDeleteMenu = useCallback((id: number | null) => {
        setSelectedMenuId(id);
        setIsDeleteMenuDialogOpen(true);
    }, []);

    const confirmDeleteMenu = useCallback(() => {
        setIsDeleteMenuDialogOpen(false); // Close the dialog immediately

        if (selectedMenuId !== null) {
            deleteMenu(selectedMenuId, {
                onSuccess: () => {
                    toast.success("Menu deleted successfully");
                    setSelectedMenuId(null);

                    // Update the selected menu list
                    const updatedMenu = selectedMenu.filter(menu => menu.id !== selectedMenuId);
                    setSelectedMenu(updatedMenu);

                    // Update the menu count in the categories
                    setCategories(categories.map(category =>
                        category.id === selectedCategory ? {
                            ...category,
                            menuCount: category.menuCount - 1
                        } : category
                    ));
                },
                onError: () => {
                    toast.error("Failed to delete menu");
                    setSelectedMenuId(null);
                }
            });
        }
    }, [selectedMenuId, deleteMenu, selectedMenu, categories, selectedCategory, setCategories]);

    const handleCreateMenu = useCallback((data: CreateMenuFormData) => {
        const { name, price, imageUrl, description, quantity } = data;
        const menuData: MenuData = {
            name,
            price,
            description,
            quantity,
            userAccountId,
            categoryId: selectedCategory // Ensure selectedCategory is used
        };

        if (imageUrl && imageUrl[0]) {
            const formData = new FormData();
            formData.append('file', imageUrl[0]); // Assuming imageUrl is a FileList

            addMenuUrl(formData, {
                onSuccess: (uploadedImageUrl: ImageResponse) => {
                    addMenu({ ...menuData, imageUrl: uploadedImageUrl.url }, {
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
                        category.id === selectedCategory ? { ...category, menuCount: category.menuCount + 1 } : category
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
    }, [addMenu, addMenuUrl, categories, menu, selectedCategory, setCategories, setMenu, userAccountId]);

    const handleRowClick = useCallback((id: number | null) => {
        setSelectedCategory(id);
        setIsDrawerOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setIsDrawerOpen(false);
        setSelectedCategory(null);
        setSelectedMenu([]);
    }, []);

    const renderDrawerContent = (): ReactNode => (
        <>
            <div className='flex flex-row justify-between p-5 text-foreground'>
                <div>
                    <h2 className='text-2xl font-semibold'>Menu for
                        Category {(categories && categories?.find(c => c.id === selectedCategory)?.name)}</h2>
                    <p className='text-sm text-muted-foreground  '>Details of the selected category's menu items.</p>
                </div>
                <div className='pr-[6rem]'>
                    <Button onClick={handleDrawerClose}>Close</Button>
                </div>
            </div>
            <div className='h-[1px] w-full bg-input'></div>
            <div className="flex flex-col overflow-auto max-h-[65vh] p-4 pb-0 text-foreground">
                {selectedMenu && selectedMenu.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="hidden md:table-cell">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='font-karla'>
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
                                    <TableCell>{menu.quantity}</TableCell>
                                    <TableCell>{formatDate(menu.createdAt)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className='z-[10000000]'>
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className='hover:bg-accent'>Edit</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className='hover:bg-destructive/90'
                                                    onClick={() => handleDeleteMenu(menu.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className='flex flex-col justify-center items-center '>
                        <p className='py-8 opacity-60'>No menu items found for this category.</p>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <Card className='w-full'>
            <TableHeaderButtons setIsDialogOpen={setIsDialogOpen} />
            <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                    Manage your Categories and view their sales performance.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeaderContainer />
                    <TableBody>
                        {categories?.map(({ id, name, menuCount, createdAt, updatedAt }) => (
                            <TableRow key={id} onClick={() => handleRowClick(id)} className='cursor-pointer'>
                                <TableCell className="font-medium">{name}</TableCell>
                                <TableCell><Badge variant="outline">Draft</Badge></TableCell>
                                <TableCell className="hidden md:table-cell">{menuCount || 0}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {updatedAt ? formatDate(updatedAt) : formatDate(createdAt as string)}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                className='focus:bg-accent'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsDrawerOpen(true);
                                                }}
                                            >
                                                View menu
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='focus:bg-accent' onClick={() => {
                                                setSelectedCategory(id);
                                                setIsCreateMenuDialogOpen(true);
                                            }}>Add menu
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='focus:bg-accent' onClick={() => {
                                                setSelectedCategory(id);
                                                setIsEditDialogOpen(true);
                                            }}>Edit
                                            </DropdownMenuItem>
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

            <CreateOrEditCategoryDialog
                isOpen={isDialogOpen}
                onOpenChange={() => setIsDialogOpen(false)}
                onSubmit={handleAddCategory}
                BtnLabel='Create'
            />

            <CreateOrEditCategoryDialog
                isOpen={isEditDialogOpen}
                onOpenChange={() => setIsEditDialogOpen(false)}
                onSubmit={handleEditCategory}
                BtnLabel='Edit'
                initialData={
                    selectedCategory !== null
                        ? categories.find((category) => category.id === selectedCategory)
                        : undefined
                }
            />

            <CustomDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={'Are you absolutely sure?'}
                message={'This action cannot be undone. This will permanently delete your category and remove its data from our servers.'}
                triggerBtnLabel='Delete'
            />

            <CustomDialog
                isOpen={isDeleteMenuDialogOpen}
                onClose={() => setIsDeleteMenuDialogOpen(false)}
                onConfirm={confirmDeleteMenu}
                title={'Are you absolutely sure?'}
                message={'This action cannot be undone. This will permanently delete your menu and remove its data from our servers.'}
                triggerBtnLabel='Delete'
            />

            <CustomDrawer
                anchor="bottom"
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            >
                {renderDrawerContent()}
            </CustomDrawer>

            <CreateMenuDialog
                isOpen={isCreateMenuDialogOpen}
                onClose={() => setIsCreateMenuDialogOpen(false)}
                onSubmit={handleCreateMenu} BtnLabel={'Create'}            />
        </Card>
    );
}
