import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import VideoHome from "./VideoHome";
import ButtonRoom from "./ButtonRoom";
import ResizeRoomButton from "./ResizeRoomButton";
import { styled,Box } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectTheme } from "../../app/slices/theme/ThemeSlice";



// const MainContainer = styled(Box)(({ theme }) => ({
//     position: "absolute",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     background: theme.palette.mode=='dark'?'rgba(56, 56, 56, 0.64)':'linear-gradient(217deg, rgba(255,0,0,.25), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.25), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.25), rgba(0,0,255,0) 70.71%)',
//     transition: "all 0.5s ease-in-out",

//   }));



const fullScreenRoomStyle = {
    width: '98%',
    height: '75vh',
    top: '1vh',
    left: '15px',
    zIndex: 200,
};

const minimizedRoomStyle = {
    width: '95%',
    height: '45vh',
    top: '16vh',
    left: '32px',
    overflow: 'hidden',
    padding: '10px'
};


const CallHome = () => {
    const [isRoomMinimized, setIsRoomMinimized] = useState(true);
   const matches = useMediaQuery("(max-width:800px)");
   const roomResizeHandler = () => { setIsRoomMinimized(!isRoomMinimized); };
  const theme=useAppSelector(selectTheme)
    return (
         <Box
            style={
            isRoomMinimized ? { ...minimizedRoomStyle, ...(matches && {width: "70%"}) } : fullScreenRoomStyle}
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
                    background: theme==='dark'?'rgba(56, 56, 56, 0.64)':'linear-gradient(217deg, rgb(255 0 0 / 4%), rgba(255,0,0,0) 70.71%),linear-gradient(127deg, rgba(0,255,0,.25), rgba(0,255,0,0) 70.71%),linear-gradient(336deg, rgba(0,0,255,.25), rgba(0,0,255,0) 70.71%)',
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