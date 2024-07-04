import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import {MenuResponse} from "@/hooks/menu/useMenu.tsx";
import {handleError} from "@/utils/utils.ts";
import {EndPoints} from "@/constants/constants.ts";

export interface MenuData {
    name: string;
    price: number;
    imageUrl?: string;
    description: string;
    userAccountId: number;
    categoryId: number;
}

const apiClient = new APIClient<MenuData, MenuResponse>(EndPoints.MENU);

const addMenuFn = (menuData: MenuData) => {
    return apiClient.post(menuData);
};

const UseAddMenu = () => {
    return useMutation({
        mutationFn: addMenuFn,
        mutationKey: ['add-menu'],
        onSuccess: (data: MenuResponse) => {
            console.log(data)
        },
        onError: (error) => {
            handleError(error)
        },
    });
};


export default UseAddMenu;
