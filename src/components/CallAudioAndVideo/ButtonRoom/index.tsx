import React from "react";
import { styled } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppSelector } from '../../../app/hooks';
import { selectVideoChats } from '../../../app/slices/VideoChatsSlice';
import Microphone from "./Microphone";
import CloseRoom from "./CloseRoom";
import ScreenShare from "./ScreenShare";
import Camera from "./Camera";



const MainContainer = styled("div")({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});



const ButtonRoom: React.FC<{isRoomMinimized: boolean;}> = ({ isRoomMinimized }) => {
    const {audioOnly,}=useAppSelector(selectVideoChats)
    const localStream=useAppSelector(state=>state.localStreamData.localStream)
    const matches = useMediaQuery("(max-width:800px)");

    if (!localStream) {
        return null;
    }

    return (
        <MainContainer>
           {!audioOnly && (
                <>
                    <ScreenShare  />
                    <Camera  />
                </>
            )} 
            <Microphone localStream={localStream} />
            <CloseRoom localStream={localStream}/>
        </MainContainer>
    );
};

export default ButtonRoom;