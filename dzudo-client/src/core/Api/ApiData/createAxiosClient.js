import axios from "axios";
import { processAccessToken } from "../../../features/functions";


import { INVALID_SIGNATURE, TIMEOUT_ACCESS } from "../../config/config";
import toast from "react-hot-toast";

let failedQueue = [];
let isRefreshing = false;

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });

    failedQueue = [];
};

export function createAxiosClient({
    options,
    getCurrentAccessToken,
    // getCurrentRefreshToken,
    clearTokens,
    logout,
    timeLag
}) {
    const client = axios.create(options);

    // Если есть ошибка обрабатываем все запросы в очереди с ошибкой и разлогиниваемся
    const handleError = (error) => {
        processQueue(error);
        logout();
        return Promise.reject(error);
    };

    const runRefresh = (originalRequest) => {
        originalRequest.headers = JSON.parse(
            JSON.stringify(originalRequest.headers || {})
        );

        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then(() => {
                    return client(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }
        isRefreshing = true;
        originalRequest._retry = true;
        return false;
        // updateRefreshToken()
        //     .then((resp) => {
        //         processQueue(null);
        //         return client(originalRequest);
        //     }, handleError)
        //     .finally(() => {
        //         isRefreshing = false;
        //     });
    }

    client.interceptors.request.use(
        (config) => {
            const token = getCurrentAccessToken();

            if (token) {
                const payload = processAccessToken(token);

                if (payload['ext'] < (Math.floor(Date.now() / 1000) + timeLag)) {   //если истек срок действия access токена

                    // if (getCurrentRefreshToken()) {         //если есть рефреш токен обновляем его 
                    //     const originalRequest = config;
                    //     return runRefresh(originalRequest);
                    // } else {                                //если нет токена возвращаем запрос без авторизации
                    //     clearTokens();      //очищаем чтоб не было ошибок в будущем
                    //     return config;
                    // }
                }
                config.headers.Authorization = "Bearer " + token;
            }

            return config;
        }
    );

    client.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            const originalRequest = error.config;

            if (
                error.response?.status === 401 &&
                (
                    error.response?.data?.Error === INVALID_SIGNATURE ||
                    error.response?.data?.Error === TIMEOUT_ACCESS
                )
            ) {
                if (originalRequest?._retry !== true) {
                    // if (getCurrentRefreshToken()) {
                    //     return runRefresh(originalRequest);
                    // } else {
                        clearTokens();
                        return Promise.reject(error);
                    // }
                } else {
                    return handleError(error);
                }

            }

            toast.error("Произошла ошибка. " + error.message)
            return Promise.reject(error);
        }
    );

    return client;
}