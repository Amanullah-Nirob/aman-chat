import React from "react";
import { styled } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const MainContainer = styled("div")({
    position: "absolute",
    bottom: '0',
    right:'10px'
});



const ResizeRoomButton: React.FC<{
    isRoomMinimized: boolean;
    handleRoomResize: () => void;
}> = ({ isRoomMinimized, handleRoomResize }) => {
    return (
        <MainContainer>
            <IconButton onClick={handleRoomResize}  sx={{color:'#fff'}}>
                {isRoomMinimized ? <FullscreenIcon /> : <FullscreenExitIcon />}
            </IconButton>
        </MainContainer>
    );
};

export default ResizeRoomButton;
