import { client } from "../axiosClient";

export function getProfile(id) {
    return client.post(
        'user/get', 
        { 'id': id}
        );
}