// external imports
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from "redux-persist";

// internal imports
import storage from "./sync-storage";
import themReducer from './theme/ThemeSlice'


const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth","theme"],
}; 

const rootReducer = combineReducers({
  theme:themReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })


});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
