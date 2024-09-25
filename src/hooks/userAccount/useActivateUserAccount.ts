import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import {EndPoints, QueryKeys} from "@/constants/constants";
import useUserAccountsStore from "@/store/useUserAccountsStore.ts";


const apiClient = new APIClient<boolean, boolean>(EndPoints.ACTIVATE_USER_ACCOUNT);

const updateUserAccountActiveStatusFn = (id: number, isActive: boolean) => {
    return apiClient.put(id, isActive);
};

const useUpdateUserAccountActiveStatus = () => {
    const updateUserAccountIsActive = useUserAccountsStore(s => s.updateUserAccountIsActive)

    return useMutation({
        mutationFn: ({id, isActive}: {
            id: number;
            isActive: boolean
        }) => updateUserAccountActiveStatusFn(id, isActive),
        mutationKey: [QueryKeys.ACTIVATE_USER_ACCOUNT],
        onSuccess: (isActive, variables) => {
            updateUserAccountIsActive(variables.id, isActive);
        }
    });
};

export default useUpdateUserAccountActiveStatus;
