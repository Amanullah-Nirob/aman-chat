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
    height: "15%",
    width: "100%",
    backgroundColor: "#5865f2",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
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
        <MainContainer
            sx={{
                ...(matches &&
                    isRoomMinimized && {
                        height: "100%",
                        width: "15%",
                        flexDirection: "column",
                    }),
            }}
        >
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