import React,{useState} from 'react';
import withAuth from '../../hooks/withAuth';
import Header from '../elements/Header';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectCustomDialogState } from '../../app/slices/CustomDialogSlice';
import CustomDialog from '../utils/CustomDialog';
import ChatList from './ChatList';


const ChatHome = () => {
const loggedinUser=useAppSelector(selectCurrentUser)
const {dialogData,showDialogActions}=useAppSelector(selectCustomDialogState)
const [dialogBody, setDialogBody] = useState<any | null >(<></>);
const [chats, setChats] = useState<any | null>([]);
const [typingChatUsers, setTypingChatUsers] = useState([]);
    return (
        <>
        {loggedinUser && 
         <>
          <Header setDialogBody={setDialogBody}></Header>

           <ChatList
           chats={chats}
           setChats={setChats}
           setDialogBody={setDialogBody}
           typingChatUsers={typingChatUsers}>
           </ChatList>




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