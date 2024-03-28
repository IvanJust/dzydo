import { createSlice } from "@reduxjs/toolkit";

const roleName = [
    [1, 'Администратор'],
    [2, 'Главный Секретарь'],
    [3, 'Супервайзер'],
    [4, 'Судья']
];

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        //сделать user и role объектами
        // id: "517670535",
        // secondname: "",
        user: {
            id: 0,
            firstname: "",
            lastname: "",
            shortName: "",
        },
        // dateBirth: "",
        role: {
            id: 0,
            name: '',
        },
        isAdmin: false,
        isLogin: false,

    },
    reducers: {
        tap: (state) => {
            state.coins += state.coinsPerClick;
        },
        setUser: (state, action)=>{
            state.id = action.payload.sub;
            state.isLogin = true;


            state.firstname = action.payload.firstname;
            // state.secondname = action.payload.scn;
            state.lastname = action.payload.lastname;

            state.shortName = `${action.payload.lst} ${action.payload.frst.substr(0, 1)}. ${action.payload.scn.substr(0, 1)}.`
        },
        unsetUser: (state)=>{
            state.id = "";
            state.isLogin = false;


            state.firstname = "";
            // state.secondname = "";
            state.lastname = "";

            // state.shortName = "";
        },
        setRole: (state, action)=>{
            state.role = action.payload.name;
        }
    },
})

export const {setRole, setUser, unsetUser } = userSlice.actions
export default userSlice.reducer