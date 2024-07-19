import axios, {AxiosError} from "axios";
import {format} from 'date-fns';
import toast from "react-hot-toast";

export const handleError = (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
            toast.error('Username or password is incorrect');
        } else if (error.response?.status === 500) {
            toast.error('Internal server error. Please try again later.');
        } else {
            toast.error(`Error: ${error.response?.statusText || 'Unknown error'}`);
        }
    } else {
        toast.error('An unexpected error occurred');
    }
}

export const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), 'MMMM dd, yyyy HH:mm:ss');
};

export const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
};
