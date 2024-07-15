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

    get = async (id?: number, config?: AxiosRequestConfig): Promise<T> => { // Add this method
        return axiosInstance
            .get<T>(`${this.endpoint}/${id}`, config)
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

    put = async (id: number | null, data: Partial<T>, config?: AxiosRequestConfig): Promise<R> => {
        return axiosInstance
            .put<R>(`${this.endpoint}/${id}`, data, config)
            .then(res => res.data);
    }

    patch = async (id: number | null, data: Partial<T>, config?: AxiosRequestConfig): Promise<R> => {
        return axiosInstance
            .patch<R>(`${this.endpoint}/${id}`, data, config)
            .then(res => res.data);
    }
}

export default APIClient;
