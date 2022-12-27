import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppSelector } from '../../../app/hooks';
import { selectVideoChats } from '../../../app/slices/VideoChatsSlice';
import Microphone from "./Microphone";
import CloseRoom from "./CloseRoom";
import ScreenShare from "./ScreenShare";
import Camera from "./Camera";
import { Box } from "@mui/material";





const ButtonRoom: React.FC<{isRoomMinimized: boolean;}> = ({ isRoomMinimized }) => {
    const {audioOnly,}=useAppSelector(selectVideoChats)
    const localStream=useAppSelector(state=>state.localStreamData.localStream)
    const matches = useMediaQuery("(max-width:800px)");

    if (!localStream) {
        return null;
    }

    return (
        <Box 
        sx={{ 
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height:{sm:'10%',xs:'0'}}}
        >
           {!audioOnly && (
                <>
                    <ScreenShare  />
                    <Camera  />
                </>
            )} 
            <Microphone localStream={localStream} />
            <CloseRoom localStream={localStream}/>
        </Box>
    );
};

export default ButtonRoom;