import { useMutation } from '@tanstack/react-query';
import APIClient from '../../services/api-client.ts';
import { handleError } from '@/utils/utils.ts';
import { EndPoints } from '@/constants/constants.ts';

const apiClient = new APIClient<FormData, ImageResponse>(EndPoints.UPLOAD);
export interface ImageResponse {
    url: string;
}

const addMenuImage = (formData: FormData) => {
    return apiClient.post(formData);
};

const useAddMenuImage = () => {
    return useMutation({
        mutationFn: addMenuImage,
        mutationKey: ['add-menu-image'],
        onSuccess: (data: ImageResponse) => {
            console.log(data);
            // toast.success('Menu image uploaded successfully');
        },
        onError: (error) => {
            handleError(error);
        },
    });
};

export default useAddMenuImage;
