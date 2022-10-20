import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setDeleteNotifsOfChat, setFetchMsgs, setGroupInfo, setSelectedChat } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { getOneToOneChatReceiver, truncateString } from './appUtils';
import { Avatar, MenuItem,Box } from "@mui/material";

const NotificationList = ({chats}:any) => {
    const  loggedInUser:any  = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const notifs = [...loggedInUser?.notifications];
    const notifGroups:any = {};

    notifs.forEach((notif:any) => {
        // Notifications grouped by 'chat'
        const notifChat:any = notif.chat;
        const chatId = notifChat._id;
        const chatName = notifChat.isGroupChat ? `group===${notifChat.chatName}`: getOneToOneChatReceiver(loggedInUser, notifChat?.users).name;
        const chatProfilePic=notifChat.isGroupChat ? `${notifChat.chatDisplayPic}`: getOneToOneChatReceiver(loggedInUser, notifChat?.users).profilePic
        const notifGroupId = `${chatId}---${chatName}---${chatProfilePic}`;
        if (notifGroups[notifGroupId]) {
          ++notifGroups[notifGroupId];
        } else {
          notifGroups[notifGroupId] = 1;
        }
      });

      const chatNotifClickHandler=(e:any)=>{
        const chatNotifId = e.target.dataset.notifGroup || e.target.parentNode.dataset.notifGroup;
        if (!chatNotifId) return;
        const chatId = chatNotifId.split("---")[0];
        const chatToBeOpened = chats.find((chat:any) => chat._id === chatId);
        dispatch(setSelectedChat(chatToBeOpened));
        dispatch(setFetchMsgs(true)); // To fetch selected chat msgs
        dispatch(setDeleteNotifsOfChat(chatId));
        if (chatToBeOpened?.isGroupChat) dispatch(setGroupInfo(chatToBeOpened));
     }


    return (
        <>
        {Object.keys(notifGroups).length ? (
        <div onClick={chatNotifClickHandler}>
          {Object.keys(notifGroups).map((notifGroupId:any) => {
            const fromGroup = notifGroupId.includes("group===");
            const notifCount = notifGroups[notifGroupId];
            let chatName = notifGroupId.split("---")[1]; 
            chatName = fromGroup ? chatName.split("===")[1] : chatName;
            const profilePhoto=notifGroupId.split("---")[2]
            return (
              <MenuItem
               sx={{marginBottom:'6px'}}
                key={notifGroupId}
                data-notif-group={notifGroupId}
              >
              <Avatar
              sx={{width:'50px !important',height:'50px !important'}}
              src={profilePhoto}
              alt={chatName}
              data-notif-group={notifGroupId}
              >

              </Avatar>

                <div className='notificationListItem'>
                <p title={chatName} data-notif-group={notifGroupId}>
                    {`${truncateString( fromGroup ? chatName : chatName.split(" ")[0], 12, 9)}`}
                </p>
                <p>
                {`${notifCount} message${notifCount > 1 ? "s" : ""}`}
                </p>


                  
                 
                </div>
              </MenuItem>
            );
          })}
        </div>
      ) : (
        <MenuItem>
        No notifications
        </MenuItem>
      )}
        </>
    );
};

export default NotificationList;