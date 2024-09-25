import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import {EndPoints, QueryKeys} from "@/constants/constants";

export interface UserAccountPasswordResetData {
    username: string,
    oldPassword: string,
    newPassword: string
}

const apiClient = new APIClient<UserAccountPasswordResetData, null>(EndPoints.CHANGE_PASSWORD);

const resetPasswordFn = (userAccountResetPasswordData: UserAccountPasswordResetData, id: number | null) => {
    return apiClient.put(id, userAccountResetPasswordData);
};

const UseEditMenu = () => {
    return useMutation({
        mutationFn: ({menuData, id}: {
            menuData: UserAccountPasswordResetData,
            id: number | null
        }) => resetPasswordFn(menuData, id),
        mutationKey: [QueryKeys.CHANGE_PASSWORD],
    });
};

export default UseEditMenu;
