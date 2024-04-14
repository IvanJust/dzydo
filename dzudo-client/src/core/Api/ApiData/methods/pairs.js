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

// export function setPairs(event_id, pair_id) {
//     return client.post(
//         'pair/set', 
//         { 
//             'event_id': event_id,
//             'id': pair_id,
//         }
//     );
// }