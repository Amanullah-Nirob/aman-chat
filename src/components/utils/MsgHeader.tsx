// external imports
import React from 'react';
import { Avatar, IconButton,AppBar } from "@mui/material";
// internal imports
import { selectAppState } from '../../app/slices/AppSlice';
import { useAppSelector } from '../../app/hooks';
import { getOneToOneChatReceiver, truncateString } from './appUtils';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import { Close } from '@mui/icons-material';

const MsgHeader = ({close,openViewProfileDialog}:any) => {
    const loggedInUser=useAppSelector(selectCurrentUser)
    const {selectedChat}:any=useAppSelector(selectAppState)
    const theme=useAppSelector(selectTheme)

    const chatName = selectedChat?.isGroupChat
    ? selectedChat?.chatName
    : getOneToOneChatReceiver(loggedInUser, selectedChat?.users)?.name;

    return (
        <div className='messageHeader' style={{boxShadow:theme==='light'?'rgb(0 0 0 / 6%) 0px 4px 6px -1px, rgb(0 0 0 / 6%) 0px 2px 4px -1px':'rgb(0 0 0 / 40%) 0px 4px 6px -1px, rgb(0 0 0 / 6%) 0px 2px 4px -1px'}}>
       
    <div className="photoAndName" onClick={openViewProfileDialog}>
        <IconButton >
        <Avatar
            src={ selectedChat?.isGroupChat ? selectedChat?.chatDisplayPic : getOneToOneChatReceiver(loggedInUser, selectedChat?.users)?.profilePic || "" }
            alt={"receiverAvatar"}
            sx={{width:'45px',height:'45px'}}
        />
        </IconButton>
        <span className="selectName" title={chatName}>
          {truncateString(chatName, 22, 17)}
         </span>
    </div>

    <div className="msgHeaderOthers">
        <IconButton onClick={close}>
          <Close />
        </IconButton>
     </div>

        </div>
    );
};

export default MsgHeader;