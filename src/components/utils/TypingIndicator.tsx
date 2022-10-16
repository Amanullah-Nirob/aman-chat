import React, { useRef } from 'react';
import {Avatar} from '@mui/material'
import LottieAnimation from './LottieAnimation'
import typingAnimData from "../../../public/animation/typing.json";

const TypingIndicator = ({ typingChatUser, showAvatar }:any) => {
    const typingGif = useRef(null);
    const typingUserData = typingChatUser?.toString().split("---") || [];
    const typingUserName = typingUserData[1] || "";
    const isGroupChat = typingUserData[3] === "true";
    return (
      <span className={`typingIndicator ${typingChatUser ? "displayTyping" : "hideTyping"}`} 
      >
        {showAvatar && (
          <Avatar
            alt={typingUserName || "Receiver"}
            src={typingUserData[2] || "Receiver"}
            style={{ height: 30, width: 30,marginRight:'6px' }}
          />
        )}
        <span>
          {typingUserName && isGroupChat ? `${typingUserName} is ` : ""}Typing
        </span>
        <LottieAnimation
          ref={typingGif}
          className={""}
          style={{ height: 22, bottom: 0,}}
          animationData={typingAnimData}
        />
      </span>
    );
  };
  
  export default TypingIndicator;