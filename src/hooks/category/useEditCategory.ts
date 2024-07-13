import { useMutation } from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import { CategoryResponse } from "@/hooks/category/useCategory";
import { EndPoints } from "@/constants/constants";
import useInventoryStore from "@/store/useInventoryStore";
import toast from "react-hot-toast";

export interface CategoryData {
    name: string;
    description: string;
}

const apiClient = new APIClient<CategoryData, CategoryResponse>(EndPoints.CATEGORY);

const editCategoryFn = (id: number | null, categoryData: Partial<CategoryData>) => {
    return apiClient.patch(id, categoryData);
};

const UseEditCategory = () => {
    const setCategories = useInventoryStore((state) => state.setCategories);
    const categories = useInventoryStore((state) => state.categories);

    return useMutation({
        mutationFn: ({ id, categoryData }: { id: number | null; categoryData: Partial<CategoryData> }) => editCategoryFn(id, categoryData),
        mutationKey: ['edit-category'],
        onSuccess: (data: CategoryResponse) => {
            const updatedCategories = categories.map((category) =>
                category.id === data.id ? data : category
            );
            setCategories(updatedCategories);
            toast.success('Category updated successfully');
        },
        onError: () => {
            toast.error('Failed to edit category');
        },
    });
};

export default UseEditCategory;
