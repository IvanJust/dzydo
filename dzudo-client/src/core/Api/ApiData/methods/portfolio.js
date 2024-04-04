import { client } from "../axiosClient";

export function getProfile(id) {
    return client.post(
        'user/get', 
        { 
            'id': id
        }
    );
}

export function setUser(login, password, firstname, lastname, patronymic) {
    return client.post(
        'user/set', 
        { 
            'login': login,
            'password': password,
            'firstname': firstname,
            'lastname': lastname,
            'patronymic': patronymic
        }
    );
}