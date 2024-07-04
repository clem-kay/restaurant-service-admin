import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import {CategoryResponse} from "@/hooks/category/useCategory.tsx";
import {EndPoints} from "@/constants/constants.ts";
import useInventoryStore from "@/store/useInventoryStore.tsx";
import toast from "react-hot-toast";

export interface CategoryData {
    name: string;
    description: string;
}

const apiClient = new APIClient<CategoryData, CategoryResponse>(EndPoints.CATEGORY);

const addCategoryFn = (categoryData: CategoryData) => {
    return apiClient.post(categoryData);
};

const UseAddCategory = () => {
    const setCategories = useInventoryStore((state) => state.setCategories);
    const categories = useInventoryStore((state) => state.categories);
    return useMutation({
        mutationFn: addCategoryFn,
        mutationKey: ['add-category'],
        onSuccess: (data: CategoryResponse) => {
            setCategories([...categories, data])
        },
        onError: () => {
            toast.error('Failed to add category')

        },
    });
};


export default UseAddCategory;
