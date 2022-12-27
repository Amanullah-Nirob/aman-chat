import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import VideoHome from "./VideoHome";
import ButtonRoom from "./ButtonRoom";
import ResizeRoomButton from "./ResizeRoomButton";
import { styled,Box } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectTheme } from "../../app/slices/theme/ThemeSlice";



const fullScreenRoomStyle = {
    width: '75%',
    height: '83vh',
    top: '9vh',
    left: '14%',
    padding: '20px',
    zIndex: 200,
};

const minimizedRoomStyle = {
    width: '100%',
    height: '100vh',
    top: '0',
    left: '0',
    overflow: 'hidden',
    zIndex: 200,
};

const mobileMinimizedRoomStyle = {
    width: '100%',
    height: '100vh',
    top: '0vh',
    left: '0',
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
           className='call_area_main'
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
                    background: '#0e0e0e',
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