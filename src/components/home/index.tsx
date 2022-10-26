import React,{useEffect, useState} from 'react';
import withAuth from '../../hooks/withAuth';
import Header from '../elements/Header';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentUser, setLoggedInUser } from '../../app/slices/auth/authSlice';
import { hideDialog, selectCustomDialogState } from '../../app/slices/CustomDialogSlice';
import CustomDialog from '../utils/CustomDialog';
import ChatList from './ChatList';
import MessagePage from './MessagePage';
import {Grid,Box} from '@mui/material'
import { selectAppState, setDeleteNotifsOfChat, setGroupInfo, setSelectedChat, toggleRefresh } from '../../app/slices/AppSlice';
import { getAxiosConfig, truncateString } from '../utils/appUtils';
import axios from 'axios';
import { displayToast } from '../../app/slices/ToastSlice';
import useMediaQuery from '@mui/material/useMediaQuery';
import MobileHeader from '../elements/MobileHeader';
import MainProfileDrawer from '../drawer/MainProfileDrawer';
import MobileNavigation from '../mobile/MobileNavigation';
import IncomingCall from '../CallAudioAndVideo/IncomingCall';
import CallHome from '../CallAudioAndVideo';
import { selectVideoChats } from '../../app/slices/VideoChatsSlice';



const ChatHome = () => {
const localStream=useAppSelector(state=>state.localStreamData.localStream)
const loggedinUser=useAppSelector(selectCurrentUser)
const dispatch=useAppDispatch()
const {selectedChat,clientSocket,isSocketConnected, deleteNotifsOfChat,refresh}:any=useAppSelector(selectAppState)
const {dialogData,showDialogActions}=useAppSelector(selectCustomDialogState)
const [dialogBody, setDialogBody] = useState<any | null >(<></>);
const [chats, setChats] = useState<any | null>([]);
const [typingChatUsers, setTypingChatUsers] = useState<any | null>([]);
const matches = useMediaQuery('(max-width:600px)');
const {callRequest}=useAppSelector(selectVideoChats)

const getTypingUserName = (typingUser:any) => truncateString(typingUser.name?.toString().split(" ")[0], 12, 9) || " ";
const getTypingChatId = (chatUser:any) => chatUser?.toString().split("---")[0];


const displayInfo = (message = "Operation Executed") => {
  dispatch( displayToast({message, type: "info", duration: 5000, positionVert: "bottom",positionHor: "center"}));
};


const groupSocketEventHandlers = () => {
  clientSocket
    .off("display updated grp")
    .on("display updated grp", (updatedGroupData:any) => {
      const { updatedGroup, createdAdmin, dismissedAdmin } = updatedGroupData;
      dispatch(toggleRefresh(!refresh));
      if (!updatedGroup) return;
      const { _id, chatName, removedUser } = updatedGroup;
      const isLoggedInUserRemoved = removedUser?._id === loggedinUser?._id;
      const isGroupInfoDialogOpen =
        dialogData.isOpen && dialogData.title === "Group Info";

      if (selectedChat?._id === _id) {
        let groupData = updatedGroup;
        if (isLoggedInUserRemoved) {
          dispatch(hideDialog());
          groupData = null;
        }
        dispatch(setSelectedChat(groupData));
        dispatch(setGroupInfo(groupData));
        if (
          isGroupInfoDialogOpen &&
          createdAdmin?._id === loggedinUser?._id
        ) {
          displayInfo(`You are now an Admin of '${chatName}' group`);
        }
        if (
          isGroupInfoDialogOpen &&
          dismissedAdmin?._id === loggedinUser?._id
        ) {
          displayInfo(`You are no longer an Admin of '${chatName}' group`);
        }
      }
      if (isLoggedInUserRemoved) {
        displayInfo(`You have been removed from '${chatName}' group`);
      }
    });


  clientSocket
    .off("remove deleted grp")
    .on("remove deleted grp", (deletedGroup:any) => {
      dispatch(toggleRefresh(!refresh));
      if (!deletedGroup) return;
      if (selectedChat?._id === deletedGroup?._id) {
        dispatch(hideDialog());
        dispatch(setSelectedChat(null));
        dispatch(setGroupInfo(null));
      }
      displayInfo(`'${deletedGroup.chatName}' Group Deleted by Admin`);
    });

  clientSocket.off("display new grp").on("display new grp", () => {
    dispatch(toggleRefresh(!refresh));
  });
};


const typingSocketEventHandler = () => {
  clientSocket
    .off("display typing")
    .on("display typing", (chat:any, typingUser:any) => {
      if (!chat || !typingUser) return;
      setTypingChatUsers([
        ...typingChatUsers, `${chat._id}---${getTypingUserName(typingUser)}---${typingUser.profilePic}---${chat.isGroupChat}`,
      ]);
    });


  clientSocket.off("hide typing").on("hide typing", (chat:any, typingUser:any) => {
    if (!chat || !typingUser) return;
    setTypingChatUsers(
      typingChatUsers.filter(  (chatUser:any) => chatUser !== `${chat._id}---${getTypingUserName(typingUser)}---${typingUser.profilePic}---${chat.isGroupChat}`
      )
    );
  });
};

  // Listening to socket events
  useEffect(() => {
    if (!clientSocket || !isSocketConnected) return;
    typingSocketEventHandler();
    groupSocketEventHandlers()
  });



// delete notification area start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// delete notification from database
  const deletePersistedNotifs = async (notifsToBeDeleted:any) => {
    const config = getAxiosConfig({ loggedinUser });
    try {
      await axios.put(
        `${process.env.API_URL}/api/user/delete/notifications`,
        { notificationIds: JSON.stringify(notifsToBeDeleted) },
        config
      );
    } catch (error:any) {
      console.log("Couldn't Delete Notifications : ", error.message);
    }
  };

 const deleteNotifications=(clickedChatId:any)=>{
  const notifs:any = [...loggedinUser?.notifications];
  const notifsToBeDeleted:any = [];
  
  for (let i = 0; i < notifs.length; ++i) {
    if (notifs[i].chat._id === clickedChatId) {
      const deletedNotif = notifs.splice(i, 1)[0];
      notifsToBeDeleted.push(deletedNotif._id);
      // After deleting element at 'i', next element (i+1) shifts back
      // to 'i' index
      --i;
    }
  }
  const updatedUser = { ...loggedinUser, notifications: notifs };
  dispatch(setLoggedInUser(updatedUser));
  deletePersistedNotifs(notifsToBeDeleted);
  dispatch(setDeleteNotifsOfChat(""));
 }


  useEffect(() => {
    if (!deleteNotifsOfChat) return;
    deleteNotifications(deleteNotifsOfChat);
  }, [deleteNotifsOfChat]);
// delete notification area end >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



    return (
        <>
        {loggedinUser && 
         <>
          <Box sx={{display:matches?'none':'block'}}>
          <Header chats={chats}  setDialogBody={setDialogBody}></Header>
          </Box>

          {/* applicationMainBody */}
         <Grid container>
              <Grid item xl={2.5} lg={3.1} md={3.7} sm={12} xs={12} sx={{display:selectedChat?{lg:'block',md:'block',sm:'none',xs:'none'}:'block'}}>
                    <ChatList 
                    chats={chats} 
                    setChats={setChats} 
                    setDialogBody={setDialogBody} 
                    typingChatUsers={typingChatUsers}> 
                    </ChatList>
              </Grid>
            
                <Grid item xl={9.5} lg={8.9} md={8.3} sm={12} xs={12} sx={{display:selectedChat?'block':{lg:'block',md:'block',sm:'none',xs:'none'}}}>
                <MessagePage
                 setDialogBody={setDialogBody}
                 typingChatUser={typingChatUsers.find(
                  (u:any) => getTypingChatId(u) === selectedChat?._id
                )} 
                 >
                 </MessagePage>
                </Grid>
          </Grid>

{/* custom dialog */}
            <CustomDialog
              dialogData={dialogData}
              showDialogActions={showDialogActions}
              showDialogClose={true}>
              {dialogBody}
            </CustomDialog>
{/* call home audio and video */}
            {localStream && <CallHome />} 
           <IncomingCall />


         </>
        }

            
        </>
    );
};

export default withAuth(ChatHome);