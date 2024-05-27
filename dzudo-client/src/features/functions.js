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
    return `${date.getDate()}.${(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function ShortName(item){
    return `${item.lastname} ${item.firstname.substr(0, 1)}. ${item.patronymic.substr(0, 1)}.`;
}
