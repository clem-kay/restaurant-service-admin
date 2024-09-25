import {useMutation, useQueryClient} from '@tanstack/react-query';
import APIClient from '../../services/api-client';
import {handleError} from '@/utils/utils';
import {EndPoints, QueryKeys} from "@/constants/constants";
import toast from "react-hot-toast";
import {UserAccountResponse} from "@/hooks/userAccount/useUserAccounts.ts";
import useUserAccountsStore from "@/store/useUserAccountsStore.ts";

const apiClient = new APIClient<null, null>(EndPoints.USER_ACCOUNTS);

const deleteUserAccountFn = (id: number | null) => {
    return apiClient.delete(id);
};

const useDeleteUserAccount = () => {
    const queryClient = useQueryClient();
    const setUserAccounts = useUserAccountsStore((state) => state.setUserAccounts);
    const userAccounts = useUserAccountsStore((state) => state.userAccounts);

    return useMutation({
        mutationFn: deleteUserAccountFn,
        onSuccess: () => {
            toast.success("User Account deleted successfully");
        },
        onMutate: async (deleteUserAccountId: number | null) => {
            await queryClient.cancelQueries({queryKey: [QueryKeys.USER_ACCOUNTS]});

            const previousUserAccountsData = queryClient.getQueryData<UserAccountResponse[]>([QueryKeys.USER_ACCOUNTS]);

            queryClient.setQueryData<UserAccountResponse[]>([QueryKeys.USER_ACCOUNTS], (old) =>
                old ? old.filter(useAccount => useAccount.id !== deleteUserAccountId) : []
            );

            setUserAccounts(userAccounts.filter(userAccount => userAccount.id !== deleteUserAccountId));

            return {previousUserAccountsData: previousUserAccountsData};
        },
        onError: (error, _deletedUserAccountId, context) => {
            if (context?.previousUserAccountsData) {
                queryClient.setQueryData([QueryKeys.USER_ACCOUNTS], context.previousUserAccountsData);
            }
            handleError(error);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: [QueryKeys.USER_ACCOUNTS]});
        },
    });
};

export default useDeleteUserAccount;
