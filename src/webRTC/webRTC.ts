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
        // TODO use TURN server credentials
    } else {
        console.warn("Using only STUN server");
        return {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
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
        config: {
            iceServers: [
            { urls: "stun:numb.viagenie.ca:3478" },
              {
                url: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
              },
              {
                url: 'turn:192.158.29.39:3478?transport=udp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
              },
              {
                url: 'turn:192.158.29.39:3478?transport=tcp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
              },
              {
                url: 'turn:turn.bistri.com:80',
                credential: 'homeo',
                username: 'homeo'
              },
              {
                url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: 'webrtc',
                username: 'webrtc'
              }
            ]
        },
        stream: stream,
    });

    
    
    return peer;
}