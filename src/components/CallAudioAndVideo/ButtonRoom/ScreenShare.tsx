import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectVideoChats, setScreenSharingStream } from '../../../app/slices/VideoChatsSlice';
import { currentPeerConnection } from '../../utils/MsgHeader';
import IconButton from "@mui/material/IconButton";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import { selectTheme } from '../../../app/slices/theme/ThemeSlice';

const ScreenShare = () => {
    const dispatch=useAppDispatch()
    const localStream=useAppSelector(state=>state.localStreamData.localStream)
     
    const [screenShareEnabled, setScreenShareEnabled] = useState(false);
    const {screenSharingStream}=useAppSelector(selectVideoChats)
    const theme=useAppSelector(selectTheme)
    const handleScreenShareToggle = async () => {

        if (screenShareEnabled) {

            try{
                currentPeerConnection?.replaceTrack(
                   screenSharingStream?.getVideoTracks()[0],
                    currentPeerConnection.streams[0].getVideoTracks()[0],
                    localStream
                );
            }catch(err){
                console.log(err);
            }


            screenSharingStream?.getTracks().forEach((track:any) => track.stop());
            dispatch(setScreenSharingStream(null));
            setScreenShareEnabled(false);

        } else {
            const mediaDevices = navigator.mediaDevices as any;
            const screenShareStream = await mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            });

            
            dispatch(setScreenSharingStream(screenShareStream));
            setScreenShareEnabled(true);

            // replace outgoing local stream with screen share stream
            // replaceTrack (oldTrack, newTrack, oldStream);
            currentPeerConnection?.replaceTrack(
                currentPeerConnection.streams[0].getVideoTracks()[0],
                screenShareStream.getTracks()[0],
                currentPeerConnection.streams[0]
            );

            // const screenTrack = screenShareStream.getVideoTracks()[0];

            // screenTrack.onended = function () {
            //     currentPeerConnection?.replaceTrack(screenTrack, videoChat.localStream?.getTracks()[0], currentPeerConnection.streams[0]);
            // };

        }
    };


    return (
        <div style={{backgroundColor:theme==='light'?'#3333':'rgb(255 255 255 / 8%)',borderRadius:'29px',marginRight:'20px'}}>
    <IconButton 
        onClick={handleScreenShareToggle}
    >
        {screenShareEnabled ? (
            <StopScreenShareIcon />
        ) : (
            <ScreenShareIcon />
        )}
    </IconButton>
        </div>
     
    );
};

export default ScreenShare;