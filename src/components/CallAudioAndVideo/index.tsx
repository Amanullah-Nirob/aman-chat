import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import VideoHome from "./VideoHome";
import ButtonRoom from "./ButtonRoom";
import ResizeRoomButton from "./ResizeRoomButton";
import { styled,Box } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectTheme } from "../../app/slices/theme/ThemeSlice";



const fullScreenRoomStyle = {
    width: '80%',
    height: '83vh',
    top: '12vh',
    left: '11%',
    zIndex: 200,
};

const minimizedRoomStyle = {
    width: '75%',
    height: '60vh',
    top: '16vh',
    left: '12%',
    overflow: 'hidden',
    padding: '10px',
    zIndex: 200,
};

const mobileMinimizedRoomStyle = {
    width: '95%',
    height: '83vh',
    top: '9vh',
    left: '10px',
    zIndex: 200,
};
const mobileFullScreenRoomStyle = {
    width: '94%',
    height: '83vh',
    top: '9vh',
    left: '13px',
    zIndex: 200,
};

const CallHome = () => {
    const [isRoomMinimized, setIsRoomMinimized] = useState(true);
   const matches = useMediaQuery("(max-width:600px)");
   const roomResizeHandler = () => { setIsRoomMinimized(!isRoomMinimized); };
  const theme=useAppSelector(selectTheme)
    return (
         <Box
            style={
            isRoomMinimized ? { ...minimizedRoomStyle, ...(matches && {...mobileMinimizedRoomStyle}) } : { ...fullScreenRoomStyle, ...(matches && {...mobileFullScreenRoomStyle}) }}
            sx={{
                ...(matches &&
                    isRoomMinimized && {
                        flexDirection: "row",
                    }),
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: theme==='dark'?'linear-gradient(217deg, rgb(255 0 0 / 4%), rgba(255,0,0,0) 70.71%),linear-gradient(127deg, rgba(0,255,0,.25), rgba(0,255,0,0) 70.71%),linear-gradient(336deg, rgba(0,0,255,.25), rgba(0,0,255,0) 70.71%)':'linear-gradient(217deg, rgb(255 0 0 / 4%), rgba(255,0,0,0) 70.71%),linear-gradient(127deg, rgba(0,255,0,.25), rgba(0,255,0,0) 70.71%),linear-gradient(336deg, rgba(0,0,255,.25), rgba(0,0,255,0) 70.71%)',
                    transition: "all 0.5s ease-in-out",
                
            }}
        >
            <VideoHome isRoomMinimized={isRoomMinimized} /> 
            <ButtonRoom isRoomMinimized={isRoomMinimized} />
            <ResizeRoomButton
                isRoomMinimized={isRoomMinimized}
                handleRoomResize={roomResizeHandler}
            />
        </Box>
    );
};

export default CallHome;