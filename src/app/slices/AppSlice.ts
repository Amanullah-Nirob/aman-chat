import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store"; 


const AppSlice = createSlice({
  name: "AppState",
  initialState: {
    selectedChat: null,
    refresh: false,
    onlineUsers:null,
    groupInfo: {
      chatDisplayPic: null,
      chatDisplayPicUrl: process.env.REACT_APP_DEFAULT_GROUP_DP,
      chatName: "",
      users: [],
    },
    fetchMsgs: false,
    deleteNotifsOfChat: "",
    clientSocket: null,
    isSocketConnected: false,
  },

  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    toggleRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    setGroupInfo: (state, action) => {
      state.groupInfo = action.payload;
    },
    setFetchMsgs: (state, action) => {
      state.fetchMsgs = action.payload;
    },
    setDeleteNotifsOfChat: (state, action) => {
      state.deleteNotifsOfChat = action.payload;
    },
    setClientSocket: (state, action) => {
      state.clientSocket = action.payload;
    },
    setSocketConnected: (state, action) => {
      state.isSocketConnected = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },

});

export const {
  setSelectedChat,
  toggleRefresh,
  setGroupInfo,
  setFetchMsgs,
  setDeleteNotifsOfChat,
  setClientSocket,
  setSocketConnected,
  setOnlineUsers
} = AppSlice.actions;

export const selectAppState = (state: RootState) => state.AppData;
export default AppSlice.reducer;