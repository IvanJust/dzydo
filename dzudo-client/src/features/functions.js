export function processAccessToken(accessToken){
    if(accessToken){
        const payload = accessToken.split('.')[1]
        return JSON.parse(atob(payload))
    }else{
        return {};
    }
}

export function getDateFromSQL(date){
    date = new Date(date);
    return `${(date.getMonth() + 1)}.${date.getDate()}.${date.getFullYear()}`;
}

export function ShortName(firstname, lastname, secondname){
    return `${lastname} ${firstname.substr(0, 1)}. ${secondname.substr(0, 1)}.`;
}
