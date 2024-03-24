function getCurrentAccessToken() {
    return sessionStorage.getItem("AccessToken");
}

function getCurrentRefreshToken() {
    return sessionStorage.getItem("RefreshToken");
}

function setRefreshedTokens(tokens){
    sessionStorage.setItem('RefreshToken', tokens)
}

function setAccessTokens(tokens){
    sessionStorage.setItem('AccessToken', tokens)
}

function clearTokens(){
    sessionStorage.removeItem('RefreshToken');
    sessionStorage.removeItem('AccessToken');
}

export {getCurrentAccessToken, getCurrentRefreshToken, setRefreshedTokens, setAccessTokens, clearTokens}