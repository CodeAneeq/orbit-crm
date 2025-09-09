import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './features/user-slice.jsx'
import sidebarReducer from './features/sidebar-slice.jsx'

const rootReducer = combineReducers({
    user: userReducer,
    sidebar: sidebarReducer
})

export default rootReducer