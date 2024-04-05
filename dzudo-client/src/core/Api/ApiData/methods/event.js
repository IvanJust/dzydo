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

export function setEvent(name, place, date) {
    return client.post(
        'event/set', 
        { 
            'name': name,
            'place': place,
            'date': date
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