import {useMutation} from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import {EndPoints, QueryKeys} from "@/constants/constants";
import useUserAccountsStore from "@/store/useUserAccountsStore.ts";
import toast from "react-hot-toast";


const apiClient = new APIClient<UpdateUserActiveStatusData, UpdateUserActiveResponse>(EndPoints.ACTIVATE_USER_ACCOUNT);

export interface UpdateUserActiveStatusData {
    isActive: boolean
}

export interface UpdateUserActiveResponse {
    isActive: boolean
}

const updateUserAccountActiveStatusFn = (id: number, isActiveData: UpdateUserActiveStatusData) => {
    return apiClient.put(id, isActiveData);
};

const useUpdateUserAccountActiveStatus = () => {
    const updateUserAccountIsActive = useUserAccountsStore(s => s.updateUserAccountIsActive)

    return useMutation({
        mutationFn: ({id, isActiveData}: {
            id: number;
            isActiveData: UpdateUserActiveStatusData
        }) => updateUserAccountActiveStatusFn(id, isActiveData),
        mutationKey: [QueryKeys.ACTIVATE_USER_ACCOUNT],
        onSuccess: (isActive, variables) => {
            updateUserAccountIsActive(variables.id, isActive.isActive);
        },
        onError:  (e) => {
            toast.error(`Could not complete action [${e}, try again.`)
        }
    });
};

export default useUpdateUserAccountActiveStatus;
