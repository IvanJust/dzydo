// export const BASE_URL_AUTH = 'https://lk.pnzgu.ru/ajax/cloud/'

export const BASE_URL_SOCKET = 'http://79.174.84.7:3001';

export const BASE_URL_DATA = 'http://79.174.84.7:3000/api/';

export const TIMELAG = 30;                                       //временной лаг для обновления токена

export const PLATFORM = 1;                                       //клиент react на LK

export const EMPTY_REFRESH = 'Refresh token is missing';

export const INVALID_SIGNATURE = 'Invalid signature';

export const TIMEOUT_ACCESS = 'Access token timeout';


const roleName = new Map([
    [0, 'Без роли'],
    // [1, 'Администратор'],
    [2, 'Главный Секретарь'],
    [3, 'Супервайзер'],
    [4, 'Судья']
]);

export { roleName };

const errorServer = new Map([
    [500, 'Сервер не отвечает'],
])

export { errorServer };
