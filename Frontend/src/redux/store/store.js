import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../slices/authSlice";
import notificationReducer from "../slices/notificationSlice";
import userReducer from "../slices/userSlice";
import learningReducer from "../slices/learningSlice";
import achievementReducer from "../slices/achievementSlice";
import popularReducer from "../slices/popularSlice";

// Action type for resetting the store
export const RESET_STATE = "RESET_STATE";

// Separate persist config for auth
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["status", "userData"],
};

// Separate persist config for user
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: [
    "id",
    "name",
    "email",
    "role",
    "avatarStyle",
    "avatarSeed",
    "avatarUrl",
    "badges",
    "enrolledCourses",
    "completedCourses",
    "certificates",
  ],
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Root reducer with reset functionality
const createRootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    // Clear all persisted state
    storage.removeItem("persist:root");
    storage.removeItem("persist:auth");
    storage.removeItem("persist:user");

    // Reset all reducers to their initial states
    state = undefined;
  }

  const reducers = {
    auth: persistedAuthReducer,
    notification: notificationReducer,
    user: persistedUserReducer,
    learning: learningReducer,
    achievements: achievementReducer,
    popular: popularReducer,
  };

  const combinedReducer = (state, action) => {
    return Object.keys(reducers).reduce(
      (acc, key) => ({
        ...acc,
        [key]: reducers[key](state?.[key], action),
      }),
      {}
    );
  };

  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: createRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          RESET_STATE,
        ],
      },
    }),
});

// Create persistor
const persistor = persistStore(store);

// Add debug listener for state changes
store.subscribe(() => {
  const state = store.getState();
  console.log("Current Redux State:", {
    auth: state.auth,
    user: state.user,
  });
});

// Function to reset the entire store
export const resetStore = () => {
  // Purge the persistor
  persistor.purge();

  // Dispatch reset action
  store.dispatch({ type: RESET_STATE });
};

export { persistor };
export default store;
