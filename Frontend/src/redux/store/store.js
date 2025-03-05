import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../slices/authSlice";
import notificationReducer from "../slices/notificationSlice";
import userReducer from "../slices/userSlice";
import learningReducer from "../slices/learningSlice";
import achievementReducer from "../slices/achievementSlice";
import popularReducer from "../slices/popularSlice";

// Separate persist config for auth
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["status", "userData"],
  blacklist: ["error", "loading"],
};

// Separate persist config for user
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: [
    "name",
    "email",
    "role",
    "avatarStyle",
    "avatarSeed",
    "avatarUrl",
  ],
  blacklist: ["error", "loading"],
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    notification: notificationReducer,
    user: persistedUserReducer,
    learning: learningReducer,
    achievements: achievementReducer,
    popular: popularReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
        ],
      },
    }),
});

// Create persistor
const persistor = persistStore(store);

// Add debug listener
persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState();
  console.log("Persistor state:", { bootstrapped });
  if (bootstrapped) {
    console.log("Current store state:", store.getState());
  }
});

export { persistor };
export default store;
