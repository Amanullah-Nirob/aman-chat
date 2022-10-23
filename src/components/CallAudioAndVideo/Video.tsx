import React, { useEffect, useRef } from "react";
import { styled } from "@mui/system";

const MainContainer = styled("div")({
    height: "100%",
    width: "100%",
    backgroundColor: "black",
    borderRadius: "8px",
    margin: '3px 7px'
});

const VideoEl = styled("video")({
    width: "100%",
    height: "100%",
});



const Video:React.FC<{ stream: MediaStream; isLocalStream: boolean;isYou:boolean}> = ({ stream, isLocalStream,isYou }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        video!.srcObject = stream;

        video!.onloadedmetadata = () => {
            video!.play()

            if (isLocalStream) {
                video!.muted = true;
                video!.volume = 0;
            }
        };

    }, [stream, isLocalStream]);

    return (
     <MainContainer>
            <VideoEl
                ref={videoRef}
                autoPlay
                muted={isLocalStream}
            />
            <span style={{color:'green',fontWeight:'bold'}}>{isYou?'you':''}</span>
     </MainContainer>
    );
};

export default Video;