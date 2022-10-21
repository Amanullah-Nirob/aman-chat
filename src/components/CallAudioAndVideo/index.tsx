import React, { useState } from "react";
import { styled } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import VideoHome from "./VideoHome";
import ButtonRoom from "./ButtonRoom";
import ResizeRoomButton from "./ResizeRoomButton";



const MainContainer = styled("div")({
    position: "absolute",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202225",
    transition: "all 0.5s ease-in-out",
});



const fullScreenRoomStyle = {
    width: "100%",
    height: "100vh",
    zIndex: 200,
};

const minimizedRoomStyle = {
    bottom: "0px",
    right: "0px",
    width: "30%",
    height: "40vh",
};


const CallHome = () => {
    const [isRoomMinimized, setIsRoomMinimized] = useState(true);
    const roomResizeHandler = () => {
        setIsRoomMinimized(!isRoomMinimized);
    };
   const matches = useMediaQuery("(max-width:800px)");

    return (
         <MainContainer
            style={
                isRoomMinimized
                    ? { ...minimizedRoomStyle, ...(matches && {width: "70%"}) }
                    : fullScreenRoomStyle
            }
            sx={{
                ...(matches &&
                    isRoomMinimized && {
                        flexDirection: "row",
                    }),
            }}
        >
            <VideoHome isRoomMinimized={isRoomMinimized} /> 
            <ButtonRoom isRoomMinimized={isRoomMinimized} />
            <ResizeRoomButton
                isRoomMinimized={isRoomMinimized}
                handleRoomResize={roomResizeHandler}
            />
        </MainContainer>
    );
};

export default CallHome;