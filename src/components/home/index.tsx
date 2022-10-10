import React,{useState} from 'react';
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
const ChatHome = () => {
const loggedinUser=useAppSelector(selectCurrentUser)
const {selectedChat}=useAppSelector(selectAppState)
const {dialogData,showDialogActions}=useAppSelector(selectCustomDialogState)
const [dialogBody, setDialogBody] = useState<any | null >(<></>);
const [chats, setChats] = useState<any | null>([]);
const [typingChatUsers, setTypingChatUsers] = useState([]);
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
                 setDialogBody={setDialogBody}>
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