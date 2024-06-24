import axios from "axios";
import { AxiosRequestConfig } from "axios";
import {LoginResponse} from "@/hooks/useLogin.tsx";
import configEnv from "@/config";

const axiosInstance = axios.create({
    baseURL: configEnv.BASE_URL,
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
