import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/api-client.ts";
import {endpoints} from "@/constants/constants";


export interface CategoryResponse {
    id: number | null;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

const apiClient = new APIClient<CategoryResponse[], null>(endpoints.CATEGORY);
const UseCategory = () => {
    return useQuery<CategoryResponse[]>({
        queryKey: ['categories'],
        queryFn: apiClient.getAll,
        staleTime: 0,
        retry: 2
    });
};

export default UseCategory;