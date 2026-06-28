import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import configEnv from "@/config";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
    failedQueue = [];
};

export const axiosInstance = axios.create({
    baseURL: configEnv.BASE_URL,
    timeout: 15_000,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthEndpoint =
            originalRequest.url?.includes("auth/login") ||
            originalRequest.url?.includes("auth/refresh");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                isRefreshing = false;
                clearAuthAndRedirect();
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${configEnv.BASE_URL}auth/refresh`,
                    {},
                    { headers: { Authorization: `Bearer ${refreshToken}` } },
                );

                const newAccessToken: string = data.access_token;
                const newRefreshToken: string = data.refresh_token;

                localStorage.setItem("token", newAccessToken);
                localStorage.setItem("refresh_token", newRefreshToken);

                axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearAuthAndRedirect();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

function clearAuthAndRedirect() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
}

class APIClient<T, R> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll = async (config?: AxiosRequestConfig) =>
        axiosInstance.get<T>(this.endpoint, config).then((res) => res.data);

    get = async (id?: number, config?: AxiosRequestConfig): Promise<T> =>
        axiosInstance.get<T>(`${this.endpoint}/${id}`, config).then((res) => res.data);

    getOne = async (id: number | string, config?: AxiosRequestConfig): Promise<R> =>
        axiosInstance.get<R>(`${this.endpoint}/${id}`, config).then((res) => res.data);

    post = async (data: T, config?: AxiosRequestConfig): Promise<R> =>
        axiosInstance.post<R>(this.endpoint, data, config).then((res) => res.data);

    patch = async (id: number | string, data: Partial<T>, config?: AxiosRequestConfig): Promise<R> =>
        axiosInstance.patch<R>(`${this.endpoint}/${id}`, data, config).then((res) => res.data);

    patchAction = async (path: string, data?: unknown, config?: AxiosRequestConfig): Promise<R> =>
        axiosInstance.patch<R>(`${this.endpoint}/${path}`, data, config).then((res) => res.data);

    put = async (id: number | null, data: Partial<T>, config?: AxiosRequestConfig): Promise<R> =>
        axiosInstance.put<R>(`${this.endpoint}/${id}`, data, config).then((res) => res.data);

    delete = async (id: number | null, config?: AxiosRequestConfig): Promise<R> =>
        axiosInstance.delete<R>(`${this.endpoint}/${id}`, config).then((res) => res.data);
}

export default APIClient;
