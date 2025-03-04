import { createSlice } from "@reduxjs/toolkit"; 

const initialState = {
    status: false,
    userData: {
        name: null,
        role: null,
        email: null,
        avatar: null
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload || initialState.userData; 
        },
        currentUser: (state, action) => {
            state.status = true;
            state.userData = action.payload || initialState.userData; 
        },
        logout: (state) => {
            state.status = false;
            state.userData = initialState.userData;
        }
    }
});

export const { login, currentUser, logout } = authSlice.actions;
export default authSlice.reducer;