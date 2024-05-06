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

export function getEvaluationAfterSupervisor(event_id){
    return client.post(
        'evaluations/getforadmin',
        {
            event_id: event_id
        }
    )
}