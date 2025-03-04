import { createSlice } from "@reduxjs/toolkit";

// Initial state for notification
const initialState = {
    show: false,
    type: "",
    message: "",
};

// Create a slice for notifications
const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.show = action.payload.show;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        resetNotification: (state) => {
            state.show = false;
            state.type = "";
            state.message = "";
        },
    },
});

// Thunk to handle the timeout logic
export const showNotificationWithTimeout = (notification) => (dispatch) => {
    dispatch(setNotification(notification));
    setTimeout(() => {
        dispatch(resetNotification());
    }, 3000);
};

export const { setNotification, resetNotification } = notificationSlice.actions;

export default notificationSlice.reducer;