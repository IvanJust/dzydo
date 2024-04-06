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

        }
    }
})

export const {setMistake} = tableSlice.actions
export default tableSlice;