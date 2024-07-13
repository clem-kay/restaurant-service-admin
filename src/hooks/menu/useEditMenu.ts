import { useMutation } from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import { MenuResponse } from "@/hooks/menu/useMenu.ts";
import { EndPoints } from "@/constants/constants.ts";

export interface MenuData {
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    userAccountId: number | null;
    categoryId: number | null;
}

const apiClient = new APIClient<MenuData, MenuResponse>(EndPoints.MENU);

const editMenuFn = (menuData: Partial<MenuData>, id: number | null) => {
    return apiClient.patch(id, menuData);
};

const UseEditMenu = () => {
    return useMutation({
        mutationFn: ({menuData, id}: {menuData: Partial<MenuData>, id: number | null}) => editMenuFn(menuData, id),
        mutationKey: ['edit-menu'],
    });
};

export default UseEditMenu;
