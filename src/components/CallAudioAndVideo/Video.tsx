import React, { useEffect, useRef } from "react";
import { styled } from "@mui/system";
import { selectCurrentUser } from "../../app/slices/auth/authSlice";
import { useAppSelector } from "../../app/hooks";

const MainContainer = styled("div")({
    height: "100%",
    width: "100%",
    backgroundColor: "black",
    position:'relative'
});

const VideoEl = styled("video")({
    width: "100%",
    height: "100%",
});



const Video:React.FC<{ stream: MediaStream; isLocalStream: boolean;isYou:boolean,callerInfo?:any}> = ({ stream, isLocalStream,isYou,callerInfo }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const loggedInUser=useAppSelector(selectCurrentUser)
   
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
            <p className={isYou?'callerName me':'callerName'}>{isYou?loggedInUser?.name + ' (me)':callerInfo?.name}</p>
     </MainContainer>
    );
};

export default Video;