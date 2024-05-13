import { client } from "../axiosClient";

export function setEventUserRole(event_id, user_id, role_id) {
    return client.post(
        'event_user_role/set', 
        { 
            'event_id': event_id,
            'user_id': user_id,
            'role_id': role_id
        }
    );
}

export function getEventUserRole(id=0) { // хз работет или нет TODO спросить Олега
    return client.post(
        'event_user_role/get', 
        { 
            'id': id!=0
        }
    );
}

export function getRole(id) {
    return client.post(
        'role/get', 
        { 
            'id': id,
        }
    );
}

export function getRoles() {
    return client.post(
        'role/get'
    );
}

export function getUsers(fio) {
    return client.post(
        'user/get',
        { 
            'fio': fio,
        }
    );
}

export function getUsersForTable(perPage, page) {
    return client.post(
        'user/get',
        { 
            'perPage': perPage,
            'page': page,
        }
    );
}

export function getEventsForTable(perPage, page) {
    return client.post(
        'event/get',
        { 
            'perPage': perPage,
            'page': page,
        }
    );
}

export function setAdmin(id_user) {
    return client.post(
        'admin/set ',
        { 
            'user_id': id_user,
        }
    );
}

export function unsetAdmin(id_user) {
    return client.post(
        'admin/unset ',
        { 
            'user_id': id_user,
        }
    );
}

export function getEvaluationAfterSupervisor(event_id){
    return client.post(
        'evaluations/getforadmin',
        {
            event_id: event_id
        }
    )
}

export function getRefereeFromEvent(id_event) {
    return client.post(
        'referee/event/get',
        { 
            'event_id': id_event,
        }
    );
}

export function getSecretaryFromEvent(id){
    return client.post(
        'secretary/event/get',
        {
            'event_id': id,
        }
    );
}

export function getSupervisorFromEvent(id){
    return client.post(
        'supervisor/event/get',
        {
            'event_id': id,
        }
    );
}

export function getCount(entity){
    return client.post(
        'count',
        {
            'entity': entity,
        }
    );
}