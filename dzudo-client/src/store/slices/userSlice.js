import { createSlice } from "@reduxjs/toolkit";
import { roleName } from "../../core/config/config";
import { ShortName } from "../../features/functions";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        //сделать user и role объектами
        // id: "517670535",
        // secondname: "",
        userInfo: {
            id: 0,
            firstname: "",
            secondname: "",
            lastname: "",
            shortName: "",
        },
        // dateBirth: "",
        role: {
            id: 0,
            name: '',
        },
        eventInfo: {
            id: 1,
            name: '',
            place: '',
            date_begin: 0,
            date_end: 0,
        },
        isAdmin: false,
        isLogin: false,
        currentPair: {
            id: 0,
        },

    },
    reducers: {
        tap: (state) => {
            state.coins += state.coinsPerClick;
        },
        setUser: (state, action)=>{
            state.userInfo.id = action.payload.sub;
            state.role.id = action.payload.role;
            state.role.name = roleName.get(action.payload.role);

            if(action.payload.admin == 1){
                state.isAdmin = true;
            }

            state.isLogin = true;

        },
        unsetUser: (state)=>{
            state.userInfo.id = 0;
            state.isLogin = false;
            state.isAdmin = false;

            state.userInfo.firstname = "";
            // state.secondname = "";
            state.userInfo.lastname = "";
            state.userInfo.shortName = "";

            state.role = {
                id: 0, 
                name: ''
            };

            // state.shortName = "";
        },
        setRole: (state, action)=>{
            state.role = action.payload.name;
        },
        getFIO: (state, action) => {
            state.userInfo.firstname = action.payload.firstname ? action.payload.firstname : '';
            state.userInfo.secondname = action.payload.patronymic ? action.payload.patronymic : '';
            state.userInfo.lastname = action.payload.lastname ? action.payload.lastname : '';
            state.userInfo.shortName = state.isAdmin ? 'Администратор' : ShortName(action.payload);
        },
        setEventInfo: (state, action) => { // TODO доделать потом сохрание эвента
            state.eventInfo = action.payload;
        },
        setCurrentPair: (state, action) => {
            state.currentPair = action.payload
        }
    },
});

export const {setRole, setUser, unsetUser, getFIO, setEventInfo, setCurrentPair } = userSlice.actions
export default userSlice.reducer