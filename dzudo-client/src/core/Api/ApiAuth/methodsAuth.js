import { clientAuth } from "./axiosClientAuth";

import { getCurrentAccessToken, getCurrentRefreshToken, setAccessTokens, setRefreshedTokens, clearTokens } from "../functions";
import { processAccessToken } from "../../../features/functions";

import store from "../../../store/store";
import toast from "react-hot-toast";

export function login(_login, password, event) {

    return clientAuth.post(
        "token/get",
        { 'event_id': event, 'login': _login, 'password': password }
    ).then((response) => {
        
        if (response.data?.token) {
            response.data_token = processAccessToken(response.data.token);
            setAccessTokens(response.data.token);
            // setRefreshedTokens(response.data.r_token);
        }
        console.debug(response);
        return response;
    })
}

export function logout() {
    return clientAuth.post(
        "logout",
        { 'a_token': getCurrentAccessToken(), 'r_token': getCurrentRefreshToken() }
    ).then((resp)=>{
        clearTokens();
        toast.error("Ваша сессия истекла. Пожалуйста, авторизуйтесь повторно");
        return resp;
    }).finally((resp)=>{
        if(!getCurrentRefreshToken()){
            store.dispatch({type: 'user/unsetUser'});
        }
    });
}

export function updateRefreshToken() {
    return clientAuth.post(
        "updatetoken",
        { 'a_token': getCurrentAccessToken(), 'r_token': getCurrentRefreshToken() }
    ).then((response)=>{
        if (response.data.a_token) {
            setAccessTokens(response.data.a_token);
            setRefreshedTokens(response.data.r_token);
            toast("Выполнено обновление токена");
        }
        return response;
    });
}


//пока безсполезна
function checkToken() {
    return clientAuth.post(
        "",
        { 'a_token': getCurrentAccessToken()}
    ).then((response)=>{
        
        return response;
    });
}

