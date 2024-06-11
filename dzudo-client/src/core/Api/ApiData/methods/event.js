import { client } from "../axiosClient";

export function getEvent(id=0) {
    return client.post(
        'event/get', 
        { 
            'id': id
        }
    );
}

export function getEvents() {
    return client.post(
        'event/get'
    );
}

export function setEvent(name, place, date_begin, date_end) {
    return client.post(
        'event/set', 
        { 
            'name': name,
            'place': place,
            'date_begin': date_begin,
            'date_end': date_end
        }
    );
}

export function getEvaletionCriteria(){
    return client.post(
        'evaluation_criteria/get'
    );
}

export function getEvaletionGroup(){
    return client.post(
        'evaluation_group/get'
    );
}

export function getMarks(){
    return client.post(
        'mark/get'
    );
}

export function saveEvaluations(data, pair_id){
    return client.post(
        'evaluations/set',
        {
            evaluations: data,
            pair_id: pair_id
        }
    );
}
export function getTable(id){
    return client.post(
        'table/get',
        {
            'event_id': id,
        }
    );
}

export function getEvaluationsForSecr(pair_id, user_id){
    return client.post(
        'evaluations/getforsecretary',
        {
            'pair_id': pair_id,
            'user_id': user_id,
        }
    );
}

export function getVotedStaff(event_id, pair_id){
    return client.post(
        'voted_staff/get',
        {
            'event_id': event_id,
            'pair_id': pair_id,
        }
    )
}

export function getTable1(event_id){
    return client.post(
        'table1/get',
        {
            'event_id': event_id,
        }
    )
}

export function getTable2(event_id){
    return client.post(
        'table2/get',
        {
            'event_id': event_id,
        }
    )
}

export function getCurrentEvent(){
    return client.post(
        'current_event/get'
    )
}