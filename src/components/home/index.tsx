import React,{useEffect, useState} from 'react';
import withAuth from '../../hooks/withAuth';
import Header from '../elements/Header';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectCustomDialogState } from '../../app/slices/CustomDialogSlice';
import CustomDialog from '../utils/CustomDialog';
import ChatList from './ChatList';
import MessagePage from './MessagePage';
import {Grid} from '@mui/material'
import { selectAppState } from '../../app/slices/AppSlice';
import { truncateString } from '../utils/appUtils';
const ChatHome = () => {
const loggedinUser=useAppSelector(selectCurrentUser)
const {selectedChat,clientSocket,isSocketConnected}:any=useAppSelector(selectAppState)
const {dialogData,showDialogActions}=useAppSelector(selectCustomDialogState)
const [dialogBody, setDialogBody] = useState<any | null >(<></>);
const [chats, setChats] = useState<any | null>([]);
const [typingChatUsers, setTypingChatUsers] = useState<any | null>([]);



const getTypingUserName = (typingUser:any) => truncateString(typingUser.name?.toString().split(" ")[0], 12, 9) || " ";
const getTypingChatId = (chatUser:any) => chatUser?.toString().split("---")[0];

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
  });

    return (
        <>
        {loggedinUser && 
         <>
          <Header setDialogBody={setDialogBody}></Header>
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

         


            <CustomDialog
              dialogData={dialogData}
              showDialogActions={showDialogActions}
              showDialogClose={true}>
              {dialogBody}
            </CustomDialog>
         
         </>
        }

            
        </>
    );
};

export default withAuth(ChatHome);