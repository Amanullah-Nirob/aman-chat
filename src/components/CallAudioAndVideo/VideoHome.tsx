import React, { useEffect, useState } from 'react';
import { styled } from "@mui/system";
import { useAppSelector } from '../../app/hooks';
import { selectVideoChats } from '../../app/slices/VideoChatsSlice';
import useMediaQuery from "@mui/material/useMediaQuery";
import Video from './Video';
import { Typography,Box } from "@mui/material";
import { store } from '../../app/store';
import { selectLoadingState, setDetectVolume } from '../../app/slices/LoadingSlice';
import { selectAppState } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { getOneToOneChatReceiver } from '../utils/appUtils';
import { selectImportantForCall } from '../../app/slices/importantForCall';


const MainContainer = styled("div")({
    height: "100%",
    width: "100%",
    display: "flex",
});


const mobileMinimizedVideoHomeStyle = {
    height: "47%",
    width: "100%",
    flexDirection: "column"
};
const mobileFullVideoHomeStyle = {
    height: "47%",
    width: "97%",
    flexDirection: "column"
};


export function handleMyVolume(data:any) {
    store.dispatch(setDetectVolume(data) as any);
}


const VideoHome = ({isRoomMinimized}:any) => {
    const localStream=useAppSelector(state=>state.localStreamData.localStream)
    const {callStatus, remoteStream, screenSharingStream }=useAppSelector(selectVideoChats)
    const matches = useMediaQuery("(max-width:600px)");
    const {selectedChat,clientSocket,isSocketConnected}:any=useAppSelector(selectAppState)
    const loggedInUser=useAppSelector(selectCurrentUser)
    const sender =  getOneToOneChatReceiver(loggedInUser, selectedChat?.users)
    const {callerInfo}=useAppSelector(selectImportantForCall)
    const {detectVolume,remoteDetectVolume}=useAppSelector(selectLoadingState)
    const [volumeDetected,setVolumeDetected]=useState(false)
    const [volumeDetectedOther,setVolumeDetectedOther]=useState(false)

    useEffect(()=>{
      let element = document.getElementById(`myPitchBar`) as HTMLElement;
      let volume = detectVolume.volume + 25;
      if (!element) return;
      if (volume > 50) {
          element.style.backgroundColor = 'red';
      }
      element.style.height = volume + '%';
      setVolumeDetected(true)
      setTimeout(function () {
          element.style.backgroundColor = '#19bb5c';
          element.style.height = '0%';
          setVolumeDetected(false)
      }, 700);
  
      clientSocket.emit("detectVolume", {
        ...detectVolume,
        senderId:loggedInUser._id,
        callerName:loggedInUser.name,
        receiverUserId: callerInfo.receiverUserId,
      });
     },[detectVolume.volume])


    useEffect(()=>{
      let element = document.getElementById(`myPitchBarRemote`) as HTMLElement;
      let volume = detectVolume.volume + 25;
      if (!element) return;
      if (volume > 50) {
          element.style.backgroundColor = 'red';
      }
      element.style.height = volume + '%';
      setVolumeDetectedOther(true)
      setTimeout(function () {
          element.style.backgroundColor = '#19bb5c';
          element.style.height = '0%';
          setVolumeDetectedOther(false)
      }, 700);
  
     },[remoteDetectVolume?.volume])

    

      
    return (
     <Box sx={{width:'100%', height:{sm:'77%',xs:'90%'},marginBottom:{sm:'53px',xs:'0'}}} className='videoHome'>
      
        <MainContainer 
        sx={{...(matches && (isRoomMinimized ? {...mobileMinimizedVideoHomeStyle}:{...mobileFullVideoHomeStyle}) )}}
        className="homeVideoAllContent">
       
            {localStream && (
               <div className='localVideoMain' id={volumeDetected ? 'speakingMe':''}>
                 <Video
                    stream={
                        screenSharingStream ? screenSharingStream : localStream
                    }
                    isYou={true}
                    isLocalStream={true}
                />
                <div id='myPitchBar'></div>
               </div>
            )}
       
           {remoteStream && (
                <div className='RemoteVideoMain' id={volumeDetectedOther ? 'speakingOther':''}>
                    <Video stream={remoteStream} isLocalStream={false} isYou={false} callerInfo={callerInfo}/>
                    <div id='myPitchBarRemote'></div>
                </div>
            )}
           
        </MainContainer>

         <div className='callStatus' style={{textAlign:'center'}}>
         {callStatus !== "accepted" && (
            <p style={{color:'green',fontWeight:'bold'}}>
                {callStatus === "ringing"
                    ? "Ringing...."
                    : callStatus === "rejected" && "Call Rejected"}
            </p>
          )}

         </div>

         
         
        </Box>
  
    );
};

export default VideoHome;