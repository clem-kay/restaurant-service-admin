import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import {EndPoints, QueryKeys} from "@/constants/constants";
import useUserAccountsStore from "@/store/useUserAccountsStore.ts";

export interface UserAccountActiveStatusData {
    isActive: boolean;
    id: number;
}

const apiClient = new APIClient<UserAccountActiveStatusData, boolean>(EndPoints.ACTIVATE_USER_ACCOUNT);

const updateUserAccountActiveStatusFn = (id: number, statusData: UserAccountActiveStatusData) => {
    return apiClient.put(id, statusData);
};

const useUpdateUserAccountActiveStatus = () => {
    const updateUserAccountIsActive = useUserAccountsStore(s => s.updateUserAccountIsActive)

    return useMutation({
        mutationFn: ({id, statusData}: {
            id: number;
            statusData: UserAccountActiveStatusData
        }) => updateUserAccountActiveStatusFn(id, statusData),
        mutationKey: [QueryKeys.ACTIVATE_USER_ACCOUNT],
        onSuccess: (isActive, variables) => {
            updateUserAccountIsActive(variables.id, isActive);
        }
    });
};

export default useUpdateUserAccountActiveStatus;
