import { createSlice } from "@reduxjs/toolkit";
import SimplePeer from "simple-peer";


interface VideoChatState {
    remoteStream: MediaStream | null;
    otherUserId: string | null;
    audioOnly: boolean;
    screenSharingStream: MediaStream | null; 
    screenSharing: boolean;

    // what caller will see
    callStatus: "ringing" | "accepted" | "rejected" | "left" | null;

    // what receiver will see
    callRequest: {
        callerName: string;
        audioOnly: boolean;
        callerUserId: string;
        signal: any;
    } | null;
}

const initialState: VideoChatState = {
    remoteStream: null,
    otherUserId: null, // id of the other user in the call
    audioOnly: false,
    screenSharingStream: null,
    screenSharing: false,
    callRequest: null,
    callStatus: null,
};

// Form Fields State
const VideoChatsSlice = createSlice({
  name: "VideoChats",
  initialState,
  reducers: {
    setRemoteStream:(state, action) => {
        state.remoteStream = action.payload;
    },
    setCallStatus:(state, action) => {
        state.callStatus = action.payload;
    },
    setCallRequest:(state, action:any) => {
        state.callRequest = action.payload;
        state.otherUserId =action.payload?.callerUserId ? action.payload.callerUserId : null
    },
    setOtherUserId:(state, action) => {
        state.otherUserId = action.payload;
    },
    setScreenSharingStream:(state, action) => {
        state.screenSharingStream = action.payload.stream;
        state.screenSharing=action.payload.isScreenSharing
    },
    setAudioOnly:(state, action) => {
        state.audioOnly = action.payload;
    },
    setReset:(state,action) =>{
        state.remoteStream = null;
        state.callStatus = null;
        state.callRequest = null;
        state.otherUserId = null;
        state.screenSharingStream = null;
        state.screenSharing = false;
        state.audioOnly = false;
    }
 

  },
});

export const { 
    setRemoteStream,
    setCallStatus,
    setCallRequest,
    setOtherUserId,
    setScreenSharingStream,
    setAudioOnly,
    setReset
} = VideoChatsSlice.actions;

export const selectVideoChats = (state:any) => state.VideoChats;

export default VideoChatsSlice.reducer;
