import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import { handleError } from '@/utils/utils';
import { EndPoints } from "@/constants/constants";
import useInventoryStore from "@/store/useInventoryStore";
import toast from "react-hot-toast";
import { MenuResponse } from "@/hooks/menu/useMenu.ts";

const apiClient = new APIClient<null, MenuResponse>(EndPoints.MENU);

const deleteMenuFn = (id: number | null) => {
    return apiClient.delete(id);
};

const useDeleteMenu = () => {
    const queryClient = useQueryClient();
    const setMenu = useInventoryStore((state) => state.setMenu);
    const menuData = useInventoryStore((state) => state.menu);

    return useMutation({
        mutationFn: deleteMenuFn,
        onSuccess: () => {
            toast.success("Menu deleted successfully");
        },
        onMutate: async (deletedMenuId: number | null) => {
            await queryClient.cancelQueries({ queryKey: ['menu'] });

            const previousMenuData = queryClient.getQueryData<MenuResponse[]>(['categories']);

            queryClient.setQueryData<MenuResponse[]>(['menu'], (old) =>
                old ? old.filter(category => category.id !== deletedMenuId) : []
            );

            setMenu(menuData.filter(menu => menu.id !== deletedMenuId));

            return { previousMenuData };
        },
        onError: (error, _deletedMenuId, context) => {
            if (context?.previousMenuData) {
                queryClient.setQueryData(['menu'], context.previousMenuData);
            }
            handleError(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['menu'] });
        },
    });
};

export default useDeleteMenu;
