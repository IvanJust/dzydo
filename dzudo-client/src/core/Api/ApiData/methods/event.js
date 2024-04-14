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