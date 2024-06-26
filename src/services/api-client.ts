// APIClient.ts
import axios, { AxiosRequestConfig } from "axios";
import configEnv from "@/config";

const axiosInstance = axios.create({
    baseURL: configEnv.BASE_URL,
});

class APIClient<T, R> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll = async (config?: AxiosRequestConfig) => {
        return axiosInstance
            .get<T>(this.endpoint, config)
            .then(res => res.data);
    }

    post = async (data: T, config?: AxiosRequestConfig): Promise<R> => {
        return axiosInstance
            .post<R>(this.endpoint, data, config)
            .then(res => res.data);
    }

    delete = async (id: number | null, config?: AxiosRequestConfig): Promise<R> => {
        return axiosInstance
            .delete<R>(`${this.endpoint}/${id}`, config)
            .then(res => res.data);
    }
}

export default APIClient;
