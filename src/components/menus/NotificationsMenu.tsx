
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAppState, setDeleteNotifsOfChat, setFetchMsgs, setGroupInfo, setSelectedChat } from '../../app/slices/AppSlice';
import { getOneToOneChatReceiver, truncateString } from '../utils/appUtils';
import Menu from '../utils/Menu';
import { Avatar, MenuItem } from "@mui/material";
import { selectCurrentUser } from '../../app/slices/auth/authSlice';

const NotificationsMenu = ({chats,anchor,setAnchor}:any) => {
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
    <Menu
        menuAnchor={anchor}
        setMenuAnchor={setAnchor}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
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
                key={notifGroupId}
                data-notif-group={notifGroupId}
              >
              <Avatar
              src={profilePhoto}
              alt={chatName}
              data-notif-group={notifGroupId}
              >

              </Avatar>
                <span>
                  {`${notifCount} message${notifCount > 1 ? "s" : ""} ${
                    fromGroup ? "in" : "from"
                  } `}
                  <span
                    title={chatName}
                    data-notif-group={notifGroupId}
                    className="text-info"
                  >
                    {`${truncateString( fromGroup ? chatName : chatName.split(" ")[0], 12, 9)}`}
                  </span>
                </span>
              </MenuItem>
            );
          })}
        </div>
      ) : (
        <MenuItem>
        No notifications
        </MenuItem>
      )}
        </Menu>
    );
};

export default NotificationsMenu;