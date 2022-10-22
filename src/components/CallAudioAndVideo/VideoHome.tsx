import React from 'react';
import { styled } from "@mui/system";
import { useAppSelector } from '../../app/hooks';
import { selectVideoChats } from '../../app/slices/VideoChatsSlice';
import useMediaQuery from "@mui/material/useMediaQuery";
import Video from './Video';
import { Typography,Box } from "@mui/material";


const MainContainer = styled("div")({
    height: "85%",
    width: "100%",
    display: "flex",
});


const mobileMinimizedVideoHomeStyle = {
    height: "90%",
    width: "97%",
    flexDirection: "column"
};
const mobileFullVideoHomeStyle = {
    height: "90%",
    width: "97%",
    flexDirection: "column"
};



const VideoHome = ({isRoomMinimized}:any) => {
    const localStream=useAppSelector(state=>state.localStreamData.localStream)
    const {callStatus, remoteStream, screenSharingStream }=useAppSelector(selectVideoChats)

    const matches = useMediaQuery("(max-width:600px)");
    return (
     <Box sx={{
        width:'100%',
        height:'85%'
       }}
        >
        <MainContainer sx={{
                ...(matches && (isRoomMinimized ? {...mobileMinimizedVideoHomeStyle}:{...mobileFullVideoHomeStyle}) ),
            }}>

            {localStream && (
                <Video
                    stream={
                        screenSharingStream ? screenSharingStream : localStream
                    }
                    isLocalStream={true}
                />
             )}
       
           {remoteStream && (
                <Video stream={remoteStream} isLocalStream={false} />
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