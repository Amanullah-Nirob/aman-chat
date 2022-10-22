import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { useAppSelector } from "../../../app/hooks";
import { selectTheme } from "../../../app/slices/theme/ThemeSlice";

const Microphone: React.FC<{
    localStream: MediaStream;
}> = ({localStream}) => {
    const [micEnabled, setMicEnabled] = useState(true);

    const handleToggleMic = () => {
        localStream.getAudioTracks().forEach((track) => track.enabled = !track.enabled);
        setMicEnabled(!micEnabled);
    };
    const theme=useAppSelector(selectTheme)


    return (
        <div style={{backgroundColor:theme==='light'?'#3333':'rgb(255 255 255 / 8%)',borderRadius:'29px',marginRight:'20px'}}
        >
         <IconButton onClick={handleToggleMic}>
            {micEnabled ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        </div>
      
    );
};

export default Microphone;
