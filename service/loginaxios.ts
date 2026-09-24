import { LocalStorage } from "@/utility/LocalStorage";
import axios from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const axiosInstance = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_BASE_URL ||
        "https://mt-autozone-api.onrender.com/api",

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
    timeout: 10000,
});

// ================= REQUEST =================

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = LocalStorage.getItem("access_token");

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// ================= RESPONSE =================

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // No response / network error
        if (!error.response) {
            return Promise.reject(error);
        }

        // ================= 401 =================

        if (
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            // Another request is already refreshing
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                    });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization =
                            `Bearer ${token}`;

                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken =
                LocalStorage.getItem("refreshToken");

            // ================= NO REFRESH TOKEN =================

            if (!refreshToken) {
                LocalStorage.clear();

                window.location.href = "/admin/login";

                return Promise.reject(error);
            }

            // ================= REFRESH TOKEN =================

            try {
                const response = await axiosInstance.post(
                    "/v1/auth/refresh-token",
                    {
                        refreshToken,
                    },
                );

                const {
                    accessToken,
                    refreshToken: newRefreshToken,
                } = response.data.tokens;

                LocalStorage.setItem(
                    "access_token",
                    accessToken,
                );

                LocalStorage.setItem(
                    "refreshToken",
                    newRefreshToken,
                );

                axiosInstance.defaults.headers.common.Authorization =
                    `Bearer ${accessToken}`;

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                processQueue(null, accessToken);

                isRefreshing = false;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                isRefreshing = false;

                LocalStorage.clear();

                window.location.href = "/admin/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;