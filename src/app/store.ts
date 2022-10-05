// external imports
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from "redux-persist";

// internal imports
import storage from "./sync-storage";
import themReducer from './slices/theme/ThemeSlice'
import toastReducer from './slices/ToastSlice'
import { userApi } from "./apisAll/userApi";
import AppSliceReducer from './slices/AppSlice'
import authSliceReducer from './slices/auth/authSlice'
import CustomDialogReducer from './slices/CustomDialogSlice'
import LoadingReducer from './slices/LoadingSlice'
import ChildDialogReducer from './slices/ChildDialogSlice'

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth","theme"],
}; 

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  auth:authSliceReducer,
  AppData: AppSliceReducer,
  theme:themReducer,
  ToastData:toastReducer,
  CustomDialogData:CustomDialogReducer,
  LoadingData:LoadingReducer,
  ChildDialogData:ChildDialogReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }) 
      .concat(userApi.middleware)


});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
