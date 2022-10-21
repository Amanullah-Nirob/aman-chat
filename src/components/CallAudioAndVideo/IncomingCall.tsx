import React from 'react'
import { styled } from "@mui/system";
import Backdrop from '@mui/material/Backdrop';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectVideoChats, setAudioOnly, setCallRequest, setRemoteStream } from '../../app/slices/VideoChatsSlice';
import { getOneToOneChatReceiver } from '../utils/appUtils';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectAppState } from '../../app/slices/AppSlice';
import { getLocalStreamPreview, newPeerConnection } from '../../webRTC/webRTC';



const MainContainer = styled("div")({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "15px 20px",
    borderRadius: "30px",
});

let currentPeerConnection: any = null;
const IncomingCall = () => {
    const dispatch=useAppDispatch()
    const {callRequest} =useAppSelector(selectVideoChats)
    const loggedInUser=useAppSelector(selectCurrentUser)
    const {selectedChat,clientSocket}:any=useAppSelector(selectAppState)
    const sender =  getOneToOneChatReceiver(loggedInUser, selectedChat?.users)



    const callResponse = (accepted: boolean, audioOnly : boolean) => {
        const data={
            receiverUserId: callRequest!.callerUserId,
            receiveSenderId:loggedInUser._id,
            accepted,
            audioOnly
        }
    
        clientSocket.emit("call-response", data);
    
        if (!data.accepted) {
            return dispatch(setCallRequest(null));
        }
    
        const peerConnection = () => {
            const peer = newPeerConnection(false);
    
            currentPeerConnection = peer;
    
            peer.on("signal", (signal:any) => {
                console.log("SIGNAL", signal);
    
                clientSocket.emit("call-response", {
                    ...data,
                    signal,
                });
            });
            peer.on("stream", (stream:any) => {
                console.log("REMOTE STREAM 1", stream);
                // TODO set remote stream
                dispatch(setRemoteStream(stream));
            });
    
            peer.signal(callRequest?.signal!);
        }
    
        getLocalStreamPreview(data.audioOnly, () => {
            peerConnection();
            dispatch(setCallRequest(null) as any);
            dispatch(setAudioOnly(data.audioOnly));
        });
    
    }


    return (
        <Backdrop
         sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}
        open={!!callRequest?.callerUserId}
    >
        <MainContainer>
            <Typography
                sx={{
                    color: "black",
                    marginBottom: "3px",
                    fontSize: "20px",
                    fontWeight: "bold",
                }}
            >
                Incoming Call from {callRequest?.callerName}
            </Typography>

            <div>
                {/* {!callRequest?.audioOnly && (
                    <IconButton
                        color="success"
                        onClick={() => {
                            handleCall(true, false);
                        }}
                    >
                        <VideocamIcon />
                    </IconButton>
                )} */}

                <IconButton
                    color="success"
                    onClick={() => {
                        callResponse(true, false);
                    }}
                >
                    <VideocamIcon />
                </IconButton>

                <IconButton
                    color="success"
                    onClick={() => {
                        callResponse(true, true);
                    }}
                >
                    <PhoneInTalkIcon />
                </IconButton>

                <IconButton
                    color="error"
                    onClick={() => {
                        callResponse(false, true);
                    }}
                >
                    <PhoneDisabledIcon />
                </IconButton>
            </div>
        </MainContainer>
    </Backdrop>
    );
};

export default IncomingCall;