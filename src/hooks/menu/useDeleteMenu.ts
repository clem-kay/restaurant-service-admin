import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import { handleError } from '@/utils/utils';
import { EndPoints } from "@/constants/constants";
import useInventoryStore from "@/store/useInventoryStore";
import toast from "react-hot-toast";
import { MenuResponse } from "@/hooks/menu/useMenu.tsx";

const apiClient = new APIClient<null, MenuResponse>(EndPoints.MENU);

const useDeleteMenu = () => {
    const queryClient = useQueryClient();
    const setMenu = useInventoryStore((state) => state.setMenu);
    const menuData = useInventoryStore((state) => state.menu);

    return useMutation({
        mutationFn: (id: number | null) => apiClient.delete(id),
        onSuccess: () => {
            toast.success("Menu item deleted successfully");
        },
        onMutate: async (deletedMenuId: number | null) => {
            await queryClient.cancelQueries({ queryKey: ['foodmenu'] });

            const previousMenuData = queryClient.getQueryData<MenuResponse[]>(['foodmenu']);

            queryClient.setQueryData<MenuResponse[]>(['foodmenu'], (old) =>
                old ? old.filter((item) => item.id !== deletedMenuId) : []
            );

            setMenu(menuData.filter((menu) => menu.id !== deletedMenuId));

            return { previousMenuData };
        },
        onError: (error, _deletedMenuId, context) => {
            if (context?.previousMenuData) {
                queryClient.setQueryData(['foodmenu'], context.previousMenuData);
            }
            handleError(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['foodmenu'] });
        },
    });
};

export default useDeleteMenu;
