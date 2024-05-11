import { client } from "../axiosClient";

export function getPairs(event_id, pair_id) {
    return client.post(
        'pair/get', 
        { 
            'event_id': event_id,
            'id': pair_id,
        }
    );
}

export function setPair(event_id, tori, uke, region, round) {
    return client.post(
        'pair/set', 
        { 
            'event_id': event_id,
            'tori': tori,
            'uke': uke,
            'region': region,
            'round': round,
        }
    );
}

export function getForSuper(pair_id, id_user) {
    return client.post(
        'evaluations/getforsuper',
        {
            'pair_id': pair_id,
            'user_id': id_user
        }
    )
}