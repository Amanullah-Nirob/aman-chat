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

const VideoHome = ({isRoomMinimized}:any) => {
    const localStream=useAppSelector(state=>state.localStreamData.localStream)
    const {callStatus, remoteStream, screenSharingStream }=useAppSelector(selectVideoChats)

    const matches = useMediaQuery("(max-width:800px)");
    return (
        // <MainContainer sx={{
        //     ...(matches && isRoomMinimized && {
        //         height: "100%",
        //         width: "85%",
        //         flexDirection: "column",
        //     }),
        // }}>
        //     {localStream && (
        //         <Video
        //             stream={
        //                 screenSharingStream ? screenSharingStream : localStream
        //             }
        //             isLocalStream={true}
        //         />
        //     )}

        //     {callStatus !== "accepted" && (
        //         <Typography
        //             sx={{
        //                 color: "#b9bbbe",
        //                 fontSize: "25px",
        //                 fontWeight: "bold",
        //                 textAlign: "center",
        //                 width: "100%",
        //             }}
        //         >
        //             {callStatus === "ringing"
        //                 ? "Ringing...."
        //                 : callStatus === "rejected" && "Call Rejected"}
        //         </Typography>
        //     )}

        //     {remoteStream && (
        //         <Video stream={remoteStream} isLocalStream={false} />
        //     )}
        // </MainContainer>


     <Box sx={{
        width:'100%',
        height:'85%'
       }}
        >
        <MainContainer sx={{
                ...(matches && isRoomMinimized && {
                    height: "100%",
                    width: "85%",
                    flexDirection: "column",
                }),
            }}>
                <Video
                    stream={ screenSharingStream ? screenSharingStream : localStream }
                    isLocalStream={true}
                />
       
                <Video stream={remoteStream} isLocalStream={false} />
           
        </MainContainer>
         <div className='callStatus' style={{textAlign:'center'}}>
         <p>Ringing....</p>
         </div>
        </Box>
  
    );
};

export default VideoHome;