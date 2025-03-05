import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import learningReducer from "./slices/learningSlice";
import achievementReducer from "./slices/achievementSlice";
import popularReducer from "./slices/popularSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    learning: learningReducer,
    achievements: achievementReducer,
    popular: popularReducer,
  },
});
