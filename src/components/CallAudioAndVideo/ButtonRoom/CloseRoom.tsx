import React from "react";
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectVideoChats } from '../../../app/slices/VideoChatsSlice';
import { setReset } from "../../../app/slices/VideoChatsSlice";
import { displayToast } from "../../../app/slices/ToastSlice";
import { selectAppState } from "../../../app/slices/AppSlice";
const CloseRoom = ({localStream}:any) => {
    const {otherUserId,screenSharingStream}=useAppSelector(selectVideoChats)
    const dispatch=useAppDispatch()
     const {clientSocket}:any=useAppSelector(selectAppState)

    const handleLeaveRoom = () => {
        // notify other user that I left the call
        if (otherUserId) {
            clientSocket.emit("notify-chat-left", {otherUserId});
        }
        localStream?.getTracks().forEach((track:any) => track.stop());
        screenSharingStream?.getTracks().forEach((track:any) => track.stop());
        // dispatch(setReset(' '))
        // dispatch(displayToast({message:'You left the chat', type: "info", duration: 4000, positionVert: "bottom",positionHor: "center"}));
    };

    return (
        <IconButton onClick={handleLeaveRoom} style={{ color: "white" }}>
        <CloseIcon />
    </IconButton>
    );
};

export default CloseRoom;