import createAxiosClientAuth from "./createAxiosClient";
import { BASE_URL_DATA } from "../../config/config";

export const clientAuth = createAxiosClientAuth({
    options: {
        baseURL: BASE_URL_DATA,
        headers: {
            'Content-Type': 'application/json',
        }
    },
    // platform:PLATFORM
})