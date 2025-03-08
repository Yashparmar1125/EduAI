import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: {
    name: null,
    email: null,
    role: null,
    avatar: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
    },
    currentUser: (state, action) => {
      state.status = true;
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
    },
    logout: (state) => {
      state.status = false;
      state.userData = initialState.userData;
    },
  },
});

export const { login, currentUser, logout } = authSlice.actions;
export default authSlice.reducer;
