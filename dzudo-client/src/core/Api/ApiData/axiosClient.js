import { createAxiosClient } from "./createAxiosClient";
import { BASE_URL_DATA, TIMELAG } from "../../config/config";

import { getCurrentAccessToken, clearTokens } from "../functions";

import { logout } from "../ApiAuth/methodsAuth";

export const client = createAxiosClient({
    options: {
        baseURL: BASE_URL_DATA,
        timeout: 300000,
        headers: {
            'Content-Type': 'application/json',
        }
    },
    getCurrentAccessToken,
    // getCurrentRefreshToken,
    clearTokens,
    logout,
    timeLag: TIMELAG
})