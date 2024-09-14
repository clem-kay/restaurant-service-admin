import {useCallback, useEffect, useState} from 'react';
import {MoreHorizontal} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "react-hot-toast";
import useAddCategory, {CategoryData} from "@/hooks/category/useAddCategory";
import useDeleteCategory from "@/hooks/category/useDeleteCategory";
import useInventoryStore from "@/store/useInventoryStore";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {TableHeaderContainer} from "@/components/Dashboard/category/TableHeaderContainer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import CreateMenuDialog, {CreateMenuFormData} from "@/components/Dashboard/category/CreateMenuDialog";
import CustomDialog from "@/components/Dashboard/category/CustomDialog";
import CreateCategoryDialog from "@/components/Dashboard/category/CreateCategoryDialog";
import useAddMenu, {MenuData} from "@/hooks/menu/useAddMenu";
import useAddMenuImage, {ImageResponse} from "@/hooks/menu/useAddMenuImage";
import useAuthStore from "@/store/useAuthStore";
import {formatDate, handleError} from "@/utils/utils";
import UseMenu, {MenuResponse} from "@/hooks/menu/useMenu";
import UseCategory from "@/hooks/category/useCategory";
import useDeleteMenu from '@/hooks/menu/useDeleteMenu';
import TableHeaderButtons from "@/components/Dashboard/TableHeaderButtons";
import UseEditCategory from "@/hooks/category/useEditCategory";
import UseEditMenu from "@/hooks/menu/useEditMenu";
import CustomEditMenuDialog from "@/components/Dashboard/category/EditMenuDialog.tsx";
import CustomEditCategoryDialog from "@/components/Dashboard/category/EditCategoryDialog.tsx";
import useUserAccounts from "@/hooks/userAccount/useUserAccounts.ts";

export default function UserAccountTable() {
    const {data: userAccounts} = useUserAccounts();
    const categories = useInventoryStore((state) => state.categories);
    const {data: menuData} = UseMenu();
    const userAccountId = useAuthStore(s => s.user.userId);
    const setMenu = useInventoryStore(s => s.setMenu);
    const menu = useInventoryStore((state) => state.menu);
    const {mutate: addCategory} = useAddCategory();
    const {mutate: deleteCategory} = useDeleteCategory();
    const {mutate: addMenuUrl} = useAddMenuImage();
    const {mutate: addMenu} = useAddMenu();
    const {mutate: deleteMenu} = useDeleteMenu();
    const {mutate: editCategory} = UseEditCategory();
    const {mutate: editMenu} = UseEditMenu();
    const setCategories = useInventoryStore((state) => state.setCategories);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isEditMenuDialogOpen, setIsEditMenuDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateMenuDialogOpen, setIsCreateMenuDialogOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<MenuResponse[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
    const [isDeleteMenuDialogOpen, setIsDeleteMenuDialogOpen] = useState(false);
    const [selectedMenuData, setSelectedMenuData] = useState<Partial<MenuData> | null>(null);
    const [filter, setFilter] = useState<string>('latest'); // Add state for filter

    useEffect(() => {
        if (userAccounts) {
            setCategories(userAccounts);
        }
    }, [userAccounts, setCategories]);

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
        if (selectedCategory !== null) {
            editCategory({id: selectedCategory, categoryData: data}, {
                onSuccess: () => {
                    toast.success("Category updated successfully");
                    setIsEditDialogOpen(false);
                },
                onError: () => {
                    toast.error("Failed to update category");
                    setIsEditDialogOpen(false);
                }
            });
        }
    }, [editCategory, selectedCategory]);

    const handleEditMenu = useCallback((data: Partial<MenuData>, file?: File) => {
        if (selectedMenuId !== null) {
            const menuData = {
                ...data,
                userAccountId,
                categoryId: selectedCategory,
            };

            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                addMenuUrl(formData, {
                    onSuccess: (uploadedImageUrl: ImageResponse) => {
                        editMenu({
                            id: selectedMenuId,
                            menuData: {...menuData, imageUrl: uploadedImageUrl.url}
                        }, {
                            onSuccess: (updatedMenu, previousMenu) => {
                                toast.success("Menu updated successfully");
                                const updatedStoreMenu = menu.filter((menu) => menu.id !== previousMenu.id)
                                setMenu([...updatedStoreMenu, updatedMenu]);
                                setSelectedMenu(updatedStoreMenu.filter((menu: {
                                    categoryId: number | null;
                                }) => menu.categoryId === selectedCategory));
                                setIsEditMenuDialogOpen(false);
                            },
                            onError: () => {
                                toast.error("Failed to update menu");
                                setIsEditMenuDialogOpen(false);
                            }
                        });
                    },
                    onError: () => {
                        toast.error("Failed to upload new image");
                        setIsEditMenuDialogOpen(false);
                    }
                });
            } else {
                editMenu({
                    id: selectedMenuId,
                    menuData
                }, {
                    onSuccess: (updatedMenu, previousMenu) => {
                        toast.success("Menu updated successfully");
                        const updatedStoreMenu = menu.filter((menu) => menu.id !== previousMenu.id)
                        setMenu([...updatedStoreMenu, updatedMenu]);
                        setSelectedMenu(updatedStoreMenu.filter((menu: {
                            categoryId: number | null;
                        }) => menu.categoryId === selectedCategory));
                        setIsEditMenuDialogOpen(false);
                    },
                    onError: () => {
                        toast.error("Failed to update menu");
                        setIsEditMenuDialogOpen(false);
                    }
                });
            }
        }
    }, [selectedMenuId, userAccountId, selectedCategory, addMenuUrl, editMenu, menu, setMenu]);

    const handleDelete = useCallback((id: number | null) => {
        setSelectedCategory(id);
        setIsDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        setIsDeleteDialogOpen(false);
        if (selectedCategory !== null) {
            deleteCategory(selectedCategory, {
                onSuccess: () => {
                    toast.success("Category deleted successfully");
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
        const {name, price, imageUrl, description, quantity} = data;
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
                    addMenu({...menuData, imageUrl: uploadedImageUrl.url}, {
                        onSuccess: (newMenu) => {
                            toast.success("Menu created successfully");
                            const updatedMenu = [...menu, newMenu];
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
    }, [addMenu, addMenuUrl, categories, menu, selectedCategory, setCategories, setMenu, userAccountId]);


    const handleFilterChange = (filter: string) => {
        setFilter(filter);
    };

    const getFilteredCategories = () => {
        if (filter === 'latest') {
            return categories.slice().sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
        } else if (filter === 'oldest') {
            return categories.slice().sort((a, b) => new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime());
        } else if (filter === 'name') {
            return categories.slice().sort((a, b) => a.name.localeCompare(b.name));
        } else {
            return categories;
        }
    };

    const exportToCSV = () => {
        const headers = ["Username", "Created At", "Updated At"];
        const rows = categories.map(category => [
            category.name,
            formatDate(category.createdAt as string),
            formatDate(category.updatedAt as string)
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "categories.csv");
        document.body.appendChild(link);

        link.click();
    };


    return (
        <Card className='w-full'>
            <TableHeaderButtons setIsDialogOpen={setIsDialogOpen} onFilterChange={handleFilterChange}
                                onExport={exportToCSV}/>
            <CardHeader>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>
                    Manage your Users Accounts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeaderContainer/>
                    <TableBody>
                        {getFilteredCategories().map(({id, name, menuCount, createdAt, updatedAt}) => (
                            <TableRow key={id} className='cursor-pointer'>
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
                                                <MoreHorizontal className="h-4 w-4"/>
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                className='focus:bg-accent'
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

            <CreateCategoryDialog
                isOpen={isDialogOpen}
                onOpenChange={() => setIsDialogOpen(false)}
                onSubmit={handleAddCategory}
            />

            <CustomEditCategoryDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSubmit={handleEditCategory}
                initialData={
                    selectedCategory !== null
                        ? categories.find((category) => category.id === selectedCategory)
                        : undefined
                }
            />

            <CustomEditMenuDialog
                isOpen={isEditMenuDialogOpen}
                onClose={() => setIsEditMenuDialogOpen(false)}
                onSubmit={handleEditMenu}
                initialData={selectedMenuData as Partial<MenuData>}
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


            <CreateMenuDialog
                isOpen={isCreateMenuDialogOpen}
                onClose={() => setIsCreateMenuDialogOpen(false)}
                onSubmit={handleCreateMenu} BtnLabel={'Create'}/>
        </Card>
    );
}
