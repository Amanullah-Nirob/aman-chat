import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useAppSelector } from '../../../app/hooks';
import { selectTheme } from "../../../app/slices/theme/ThemeSlice";

const Camera = () => {
    const localStream:any=useAppSelector(state=>state.localStreamData.localStream)
    const theme=useAppSelector(selectTheme)
    const [cameraEnabled, setCameraEnabled] = useState(true);

    const handleToggleCamera = () => {
        localStream.getVideoTracks().forEach((track:any) => track.enabled = !track.enabled);
        setCameraEnabled(!cameraEnabled);
    };



    return (
        <div style={{backgroundColor:theme==='light'?'#3333':'rgb(255 255 255 / 8%)',borderRadius:'29px',marginRight:'20px'}}>
          <IconButton onClick={handleToggleCamera}>
        {cameraEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>
        </div>
       
    );
};

export default Camera;