import { createSlice } from "@reduxjs/toolkit";



export const tableSlice = createSlice({
    name: 'table',
    initialState: {
        // id: "517670535",
        idSub: 0,
        idEvent: 0,
        dateBegin: 0,
        dateEnd: 0,
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
        isAdmin: false,
        isLogin: false,

    },
    reducers: {
        setMistake: (state, action) => {

        }
    }
})

export const {setMistake} = tableSlice.actions
export default tableSlice;