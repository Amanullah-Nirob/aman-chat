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
import { Avatar, Box } from '@mui/material';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import CloseIcon from '@mui/icons-material/Close';



let currentPeerConnection: any = null;
const IncomingCall = () => {
    const dispatch=useAppDispatch()
    const {callRequest} =useAppSelector(selectVideoChats)
    const loggedInUser=useAppSelector(selectCurrentUser)
    const {selectedChat,clientSocket}:any=useAppSelector(selectAppState)
   const theme=useAppSelector(selectTheme)


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
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: "flex",
            color:'#fff',
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}
        open={!!callRequest?.callerUserId}
    >
        {/* main content */}
    <Box
        sx={{
            backgroundColor:theme==='light'?'#ddd':'rgba(56, 56, 56, 0.64)',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px 20px",
            borderRadius: "5px",
        }}
        >
{/* caller photo */}
        <div className='callerPhoto'>
            <Avatar src={callRequest?.callerPhoto} alt={callRequest?.callerName}
             sx={{width:'64px',height:'64px'}}
            >
            </Avatar>
         </div>

{/* caller Name */}
            <div className='callerInfo'>
                  <div className="callerName">
                  <h2>{callRequest?.callerName} is </h2>
                  <h2>calling you</h2>
                  </div>
                 <p style={{color:theme==='light'?'#fff':'#c3c3c3'}}>The call will start as soon as you accept</p>
            </div>

   
{/* accept or Decline */}
            <div className='callAction'>
                {!callRequest?.audioOnly ? (
                    <div className='callButton'>
                      <div className="callBtnIcon" style={{backgroundColor:'#46d159'}}>
                      <IconButton onClick={() => {callResponse(true, false)}}>
                        <VideocamIcon />
                    </IconButton>
                      </div>
                    <p>Accept</p>
                    </div>
                 
                ):(
                 <div className='callButton'>
                      <div className="callBtnIcon" style={{backgroundColor:'#46d159'}}>
                    <IconButton onClick={() => {callResponse(true, true)}}>
                        <PhoneInTalkIcon />
                    </IconButton>
                      </div>
               
                <p>Accept</p>
               </div>
         
                )
            }
              <div className='callButton'>
              <div className="callBtnIcon" style={{backgroundColor:'#ff443d'}}>
              <IconButton onClick={() => {callResponse(false, true)}}>
                    <CloseIcon />
                </IconButton>
              </div>
                <p>Decline</p>
              </div>
            
            </div>
        </Box>
    </Backdrop>
    );
};

export default IncomingCall;