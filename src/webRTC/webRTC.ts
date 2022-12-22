import Peer from "simple-peer";
import { setLocalStream } from "../app/videoChats/videoChatActions"; 
import { store } from "../app/store";


export const getLocalStreamPreview = (audioOnly: boolean, callback?: () => void) => {
 
    const constraints = { audio: true, video: audioOnly ? false : true };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {

        store.dispatch(setLocalStream(stream) as any);

        if (callback) {
            callback();
        }
        
    }).catch((err) => {
        console.log(err);
        console.log("Error getting local stream"); 
        alert("আপনার ক্যামেরা বা মাইক্রোফোনের সাথে সংযোগ করা যায়নি"); 
    })
}


const peerConfiguration = () => {
    const turnIceServers = null; 

    if (turnIceServers) {
        
    } else {
        console.warn("Using only STUN server");
        return {
            iceServers: [
                // Test some STUN server
                {
                    urls: 'stun:stun.l.google.com:19302',
                },
                // Test some TURN server
                // https://www.metered.ca/tools/openrelay/
                {
                    urls: 'turn:openrelay.metered.ca:443',
                    username: 'openrelayproject',
                    credential: 'openrelayproject',
                },
            ],
        };
    }
};


export const newPeerConnection = (initiator: boolean) => {
    
    const stream = store.getState().localStreamData.localStream 

    if (!stream) {
        throw new Error("No local stream");

    }
    
    console.log("from web ", stream);
    
    const configuration = peerConfiguration();
    const peer = new Peer({
        initiator: initiator,
        trickle: false,
        config: configuration,
        stream: stream,
    });

    
    
    return peer;
}