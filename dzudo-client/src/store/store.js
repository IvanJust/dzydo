import {configureStore} from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import tableReducer from './slices/tableSlice'



export default configureStore({
    reducer: {
        user: userReducer,
        table: tableReducer,
    },
})