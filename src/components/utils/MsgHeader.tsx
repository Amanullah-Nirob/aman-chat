// external imports
import React, { useEffect } from 'react';
import { Avatar, IconButton,AppBar,Box } from "@mui/material";
// internal imports
import { selectAppState } from '../../app/slices/AppSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getOneToOneChatReceiver, truncateString } from './appUtils';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import { Close } from '@mui/icons-material';
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { selectVideoChats, setAudioOnly, setCallStatus, setOtherUserId, setRemoteStream } from '../../app/slices/VideoChatsSlice';
import Peer from "simple-peer";
import { getLocalStreamPreview, newPeerConnection } from '../../webRTC/webRTC';
import VideoCallIcon from "@mui/icons-material/VideoCall";


let currentPeerConnection: any = null;
const MsgHeader = ({close,openViewProfileDialog,openGroupInfoDialog}:any) => {
    const loggedInUser=useAppSelector(selectCurrentUser)
    const {selectedChat,clientSocket,isSocketConnected}:any=useAppSelector(selectAppState)
    const theme=useAppSelector(selectTheme)
    const dispatch=useAppDispatch()

     
    const chatName = selectedChat?.isGroupChat ? selectedChat?.chatName: getOneToOneChatReceiver(loggedInUser, selectedChat?.users)?.name;
    const sender =  getOneToOneChatReceiver(loggedInUser, selectedChat?.users)

 // ========================================================================================================

    const callRequest = (data: { 
        receiverUserId: string;
        callerName: string;
        audioOnly: boolean;
        senderId:string
    }) => {
        // socket.emit("call-request", data);
        
        const peerConnection = () => {
            const peer = newPeerConnection(true);
    
            currentPeerConnection = peer;
    
            peer.on("signal", (signal:any) => {
                console.log("SIGNAL", signal);
                // TODO send data to server
    
                clientSocket.emit("call-request", {
                    ...data,
                    signal,
                });
            });
    
            peer.on("stream", (stream:any) => {
                console.log("REMOTE STREAM", stream);
                // TODO set remote stream
                dispatch(setRemoteStream(stream));
            });
    
            clientSocket.on("call-response", (data:any) => {
                const status = data.accepted ? "accepted" : "rejected";
                dispatch(setCallStatus(status));
    
                if (data.accepted && data.signal) {
                    console.log("ACCEPTED", data.signal);
                    dispatch(setOtherUserId(data.otherUserId));
                    peer.signal(data.signal);
                }
            });
        }
         getLocalStreamPreview(data.audioOnly, () => { 
            peerConnection();
            dispatch(setCallStatus("ringing") as any)
            dispatch(setAudioOnly(data.audioOnly) as any);
         })
    };
 

    

    return (
 <div className='messageHeader' style={{boxShadow:theme==='light'?'rgb(0 0 0 / 6%) 0px 4px 6px -1px, rgb(0 0 0 / 6%) 0px 2px 4px -1px':'rgb(0 0 0 / 40%) 0px 4px 6px -1px, rgb(0 0 0 / 6%) 0px 2px 4px -1px'}}>
    
    <Box className='mobileLeftArrow'>
         <IconButton onClick={close}>
          <ArrowBackIcon />
        </IconButton>
    </Box>
    <div className="photoAndName"
    onClick={selectedChat?.isGroupChat ? openGroupInfoDialog : openViewProfileDialog}>
        <IconButton >
        <Avatar
            src={ selectedChat?.isGroupChat ? selectedChat?.chatDisplayPic : getOneToOneChatReceiver(loggedInUser, selectedChat?.users)?.profilePic || "" }
            alt={"receiverAvatar"}
            sx={{width:'45px',height:'45px'}}
        />
        </IconButton>
        <span className="selectName" title={chatName}>
          {truncateString(chatName, 22, 17)}
         </span>
    </div>

    <div className="msgHeaderOthers" style={{display:'flex'}}>
       <div className='audioCall'>
        <IconButton
            onClick={() => {
                callRequest({
                    audioOnly: true,
                    senderId:loggedInUser._id,
                    callerName: loggedInUser.name,
                    receiverUserId: sender?._id!,
                })
            }}
        >
            <AddIcCallIcon />
        </IconButton>
       </div>
       <div className='VideoCall'>
        <IconButton
            onClick={() => {
                callRequest({
                    audioOnly: false,
                    senderId:loggedInUser._id,
                    callerName: loggedInUser.name,
                    receiverUserId: sender?._id!,
                })
            }}
        >
            <VideoCallIcon />
        </IconButton>
       </div>
     </div> 

        </div>
    );
};
export{currentPeerConnection}
export default MsgHeader;