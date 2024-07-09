import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/api-client.ts";

export interface MenuResponse {
    id: number;
    name: string;
    price: number,
    menuCount: number;
    imageUrl?: string | null,
    description?: string;
    userAccountId: number,
    categoryId: number,
    createdAt: string;
    updatedAt: string;
}

const apiClient = new APIClient<MenuResponse[], null>('foodmenu');
const UseMenu = () => {
    return useQuery<MenuResponse[]>({
        queryKey: ['foodmenu'],
        queryFn: apiClient.getAll,
        staleTime: 0,
        retry: 2
    });
};


export default UseMenu;