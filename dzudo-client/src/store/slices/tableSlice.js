import { createSlice } from "@reduxjs/toolkit";



export const tableSlice = createSlice({
    name: 'table',
    initialState: {
        // id: "517670535",
        idSub: 0,
        idEvent: 0,
        nameEvent: '',
        placeEvent: '',
        dateBegin: 0,
        dateEnd: 0,
        modalData: {

        },
        mistakes: {
            id: 0,
            name: '',
        },
        techniques: [
            {
                id: 0,
                name: '',
                idsMistakes: [],
            }
        ],

    },
    reducers: {
        setMistake: (state, action) => {

        },
        setEvent: (state, action) => {
            state.idEvent = action.payload.id;
            state.nameEvent = action.payload.name;
            state.placeEvent = action.payload.place;
            state.dateBegin = action.payload.date_begin;
            state.dateEnd = action.payload.date_end;
        }
    }
})

export const {setMistake, setEvent} = tableSlice.actions
export default tableSlice;