import {configureStore} from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import tableReducer from './slices/tableSlice'
import tableResultReducer from './slices/tableResultSlice'



export default configureStore({
    reducer: {
        user: userReducer,
        table: tableReducer,
        tableResult: tableResultReducer,
    },
})