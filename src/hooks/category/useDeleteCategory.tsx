import {useMutation, useQueryClient} from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import {CategoryResponse} from "@/hooks/category/useCategory";
import {handleError} from '@/utils/utils';
import {endpoints} from "@/constants/constants";
import useInventoryStore from "@/store/useInventoryStore";

const apiClient = new APIClient<null, CategoryResponse>(endpoints.CATEGORY);

const deleteCategoryFn = (id: number | null) => {
    return apiClient.delete(id);
};

const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    const setCategories = useInventoryStore((state) => state.setCategories);
    const categories = useInventoryStore((state) => state.categories);

    return useMutation({
        mutationFn: deleteCategoryFn,
        onMutate: async (deletedCategoryId: number | null) => {
            await queryClient.cancelQueries({queryKey: ['categories']});

            const previousCategories = queryClient.getQueryData<CategoryResponse[]>(['categories']);

            queryClient.setQueryData<CategoryResponse[]>(['categories'], (old) =>
                old ? old.filter(category => category.id !== deletedCategoryId) : []
            );

            setCategories(categories.filter(category => category.id !== deletedCategoryId));

            return {previousCategories};
        },
        onError: (error, _deletedCategoryId, context) => {
            if (context?.previousCategories) {
                queryClient.setQueryData(['categories'], context.previousCategories);
            }
            handleError(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['categories']});
        },
    });
};

export default useDeleteCategory;
