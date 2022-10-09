// external import
import React, { useEffect, useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { Box,Button} from '@mui/material';

// internal imports
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import {selectTheme} from '../../app/slices/theme/ThemeSlice'
import LoadingList from '../utils/LoadingList';
import { useGetChatQuery } from '../../app/apisAll/chat';
import { selectAppState } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { getOneToOneChatReceiver } from '../utils/appUtils';
import ChatListItem from '../utils/ChatListItem';

const ChatList = ({chats,setChats,setDialogBody,typingChatUsers}:any) => {
 const theme=useAppSelector(selectTheme)
 const loggedinUser=useAppSelector(selectCurrentUser)
 const [loading, setLoading] = useState(false);
 const dispatch=useAppDispatch()
 const { selectedChat, refresh,onlineUsers } = useAppSelector(selectAppState);
//  const { data, isError, isLoading, isSuccess, error }=useGetChatQuery('')
 const [filteredChats, setFilteredChats] = useState(chats);
 const notifs = [...loggedinUser?.notifications];


 const fetchChats= (onlineUsers:any)=>{
      try {
      setLoading(true)
      fetch(`${process.env.API_URL}/api/chat`,{
          headers: {'Authorization': `Bearer ${loggedinUser.token}`},
      }).then(res=>res.json())
      .then(data=>{

        const mappedChats = data.map((chat:any) => {
          const { isGroupChat, users } = chat;
          if (!isGroupChat) {
            const receiver = getOneToOneChatReceiver(loggedinUser, users);
            chat["chatName"] = receiver?.name;
            chat["receiverEmail"] = receiver?.email;
            chat["chatDisplayPic"] = receiver?.profilePic;
            onlineUsers?.forEach((user:any)=>{
              if(user.userId === receiver._id){
                chat["isOnline"] = true
              }
            })
          }else{
            onlineUsers?.forEach((user:any)=>{
              users.forEach((normalUser:any)=>{
                if(normalUser._id!==loggedinUser._id){
                  if(normalUser._id===user.userId){
                    chat["isOnline"] = true
                  }
                }
              })
            })
          }
 
          return chat;
        })
        .filter((chat:any) => chat.lastMessage !== undefined || chat.isGroupChat)
        console.log(mappedChats);
        
        setChats(mappedChats);
        setFilteredChats(mappedChats);
        setLoading(false)

      })
      } catch (error) {
         console.log(error);
         setLoading(false)
      }
 }


 useEffect(()=>{
  fetchChats(onlineUsers)
 },[refresh,onlineUsers])


    return (
        <div className='chatListArea-main' style={{borderColor:theme==='light'?'rgb(233 226 226)':'#444242'}}>

          <Box className="chatListHeader">
           <div className="headerTitle">
           <div className="titleMain">
             <h2>Chat</h2>
            </div>
          <div className='groupChatCreate' style={{backgroundColor:theme==='light'?'#ddd':'#4e4f50'}}>
            <Button
            sx={{borderRadius:'82px',minWidth: '40px',padding:'6px 0',color:theme==='light'?'#000':'#fff'}}
            ><GroupIcon /></Button>
          </div>
           </div>
           <div className="headerSearch">
             <input type="text" placeholder='Search Chat' style={{backgroundColor:theme==='light'?'#f0f2f5':'#3b3b3b',color:theme==='light'?'#000':'#eee'}} />
           </div>
          </Box>

          <Box className='chatListAreaMain' 
          sx={{ overflow:"auto", scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '0.4em',
          },
          '&::-webkit-scrollbar-track': {
            background: theme==='light'?'#f1f1f1':'#424242',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme==='light'?'#88888896':'#7b7b7b',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme==='light'?'#A8a8a8':'#999',
          }
          }}>

          {loading ? 
          <LoadingList listOf="Chat" dpRadius={"49px"} count={9} />
          :
           filteredChats?.length > 0 ?(  
            <div>
              {filteredChats.map((chat:any)=>{
               // notification count
               let chatNotifCount = 0;
               notifs?.forEach((notif:any) => {
                if (notif.chat._id === chat._id) ++chatNotifCount;
              });
              return(
               <ChatListItem key={chat._id}
               chat={chat}
               chatNotifCount={chatNotifCount || ""}
               typingChatUser={typingChatUsers?.find(
                (u:any) => u?.toString()?.split("---")[0] === chat._id
               )}
               >
               </ChatListItem>
              )
              })
              }
            </div>
           ):(
             ''
           )
          }
           </Box> 

        </div>
    );
};

export default ChatList;