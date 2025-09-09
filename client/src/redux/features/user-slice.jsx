import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: [],
  isLogin: "",
  role: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      addUser: (state, action) => {
        state.userData = action.payload;
        state.isLogin = true;
        state.role = action.payload?.role;
      },
      removeUser: (state) => {
        state.userData = [];
        state.isLogin = false;
        state.role = ""
      }
    }
})

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer