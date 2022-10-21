import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useAppSelector } from '../../../app/hooks';

const Camera = () => {
    const localStream:any=useAppSelector(state=>state.localStreamData.localStream)

    const [cameraEnabled, setCameraEnabled] = useState(true);

    const handleToggleCamera = () => {
        localStream.getVideoTracks().forEach((track:any) => track.enabled = !track.enabled);
        setCameraEnabled(!cameraEnabled);
    };

    return (
        <IconButton onClick={handleToggleCamera} style={{ color: "white" }}>
        {cameraEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>
    );
};

export default Camera;