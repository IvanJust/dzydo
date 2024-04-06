function getCurrentAccessToken() {
    return sessionStorage.getItem("AccessToken");
}

function setAccessTokens(tokens){
    sessionStorage.setItem('AccessToken', tokens)
}

function clearTokens(){
    sessionStorage.removeItem('AccessToken');
}

export {getCurrentAccessToken, setAccessTokens, clearTokens}