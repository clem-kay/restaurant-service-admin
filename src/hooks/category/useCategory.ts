import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/api-client.ts";
import {EndPoints} from "@/constants/constants";


export interface CategoryResponse {
    id: number | null;
    name: string;
    description: string;
    menuCount: number;
    createdAt?: string;
    updatedAt?: string;
}

const apiClient = new APIClient<CategoryResponse[], null>(EndPoints.CATEGORY);
const UseCategory = () => {
    return useQuery<CategoryResponse[]>({
        queryKey: ['categories'],
        queryFn: apiClient.getAll,
        staleTime: 0,
        retry: 2
    });
};

export default UseCategory;