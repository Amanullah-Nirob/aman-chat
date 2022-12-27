// external imports
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,} from "redux-persist";
import storageSession from 'redux-persist/lib/storage/session'

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
import VideoChatsReducer from './slices/VideoChatsSlice'
import { chatApi } from "./apisAll/chat";
import localStreamReducer from './videoChats/videoChatReducer'
import importantForCallReducer from './slices/importantForCall'

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth","theme"],
}; 
const importantForCallPersistConfig = { key: 'importantForCall', version: 1, storage:storageSession };

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  auth:authSliceReducer,
  AppData: AppSliceReducer,
  theme:themReducer,
  ToastData:toastReducer,
  CustomDialogData:CustomDialogReducer,
  LoadingData:LoadingReducer,
  ChildDialogData:ChildDialogReducer,
  VideoChats:VideoChatsReducer,
  localStreamData:localStreamReducer,
  importantForCall:persistReducer(importantForCallPersistConfig,importantForCallReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }) 
      .concat(userApi.middleware)
      .concat(chatApi.middleware)


});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
