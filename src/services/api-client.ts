import axios from "axios";
import { AxiosRequestConfig } from "axios";
import {LoginResponse} from "@/hooks/useLogin.tsx";

const axiosInstance = axios.create({
    baseURL: 'https://restaurant-service-9ee4.onrender.com/api/v1/',
})

class APIClient<T> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll = async (config?: AxiosRequestConfig) => {
        return axiosInstance
            .get<T>(this.endpoint, config)
            .then(res => res.data);
    }

    post = async (data: T, config?: AxiosRequestConfig): Promise<LoginResponse> => {
        return axiosInstance
            .post<LoginResponse>(this.endpoint, data, config)
            .then(res => res.data);
    }
}

export default APIClient;
