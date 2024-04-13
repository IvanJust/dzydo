import { createSlice } from "@reduxjs/toolkit";



export const tableResultSlice = createSlice({
    name: 'tableResult',
    initialState: {
        id: 0,
        name: '',
        place: '',
        dateBegin: 0,
        dateEnd: 0,
    },
    reducers: {
        setMistake: (state, action) => {

        },
        setEvent: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.place = action.payload.place;
            state.dateBegin = action.payload.date_begin;
            state.dateEnd = action.payload.date_end;
        }
    }
})

export const {setMistake, setEvent} = tableResultSlice.actions
export default tableResultSlice.reducer;