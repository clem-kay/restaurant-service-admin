import { useMutation } from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import { MenuResponse } from "@/hooks/menu/useMenu";
import { EndPoints } from "@/constants/constants";

export interface MenuData {
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    description?: string;
    userAccountId: number | null;
    categoryId: number | null;
}

const apiClient = new APIClient<MenuData, MenuResponse>(EndPoints.MENU);

const editMenuFn = (menuData: Partial<MenuData>, id: number | null) => {
    return apiClient.put(id, menuData);
};

const UseEditMenu = () => {
    return useMutation({
        mutationFn: ({menuData, id}: {menuData: Partial<MenuData>, id: number | null}) => editMenuFn(menuData, id),
        mutationKey: ['edit-menu'],
    });
};

export default UseEditMenu;
