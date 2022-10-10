// external import
import React, { useEffect, useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { Box,Button,List,ListItemButton} from '@mui/material';

// internal imports
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import {selectTheme} from '../../app/slices/theme/ThemeSlice'
import LoadingList from '../utils/LoadingList';
import { useGetChatQuery } from '../../app/apisAll/chat';
import { selectAppState, setDeleteNotifsOfChat, setFetchMsgs, setGroupInfo, setSelectedChat } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { debounce, getOneToOneChatReceiver, truncateString } from '../utils/appUtils';
import ChatListItem from '../utils/ChatListItem';



const ChatList = ({chats,setChats,setDialogBody,typingChatUsers}:any) => {
 const theme=useAppSelector(selectTheme)
 const loggedinUser=useAppSelector(selectCurrentUser)
 const [loading, setLoading] = useState(false);
 const dispatch=useAppDispatch()
 const { selectedChat, refresh,onlineUsers }:any = useAppSelector(selectAppState);
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

        setChats(mappedChats);
        setFilteredChats(mappedChats);
        setLoading(false)

      })
      } catch (error) {
         console.log(error);
         setLoading(false)
      }
 }

   // Debouncing filterChats method to limit the no. of fn calls
   const searchChats = debounce((e:any) => {
    const chatNameInput = e.target.value?.toLowerCase().trim();
    if (!chatNameInput) return setFilteredChats(chats);
    setFilteredChats(
      chats.filter((chat:any) =>
        chat?.chatName?.toLowerCase().includes(chatNameInput)
      )
    );
  }, 600);



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
             <input  type="text" placeholder='Search Chat' style={{backgroundColor:theme==='light'?'#f0f2f5':'#3b3b3b',color:theme==='light'?'#000':'#eee'}}
              onChange={(e) => searchChats(e)} 
              />
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
            <div
             onClick={(e:any)=>{
              const { dataset }:any = e.target;
              const parentDataset = e.target.parentNode.dataset;
              const clickedChatId = dataset.chat || parentDataset.chat;
              const hasNotifs = dataset.hasNotifs || parentDataset.hasNotifs;
              if (!clickedChatId) return;


              const clickedChat = filteredChats.find(
                (chat:any) => chat._id === clickedChatId
              );
              if (clickedChat._id === selectedChat?._id) return;
              dispatch(setSelectedChat(clickedChat));
              dispatch(setFetchMsgs(true));
              if (clickedChat?.isGroupChat) dispatch(setGroupInfo(clickedChat));

              if (hasNotifs) dispatch(setDeleteNotifsOfChat(clickedChatId));

             }}
            
            >
              {filteredChats.map((chat:any)=>{
               // notification count
               let chatNotifCount = 0;
               notifs?.forEach((notif:any) => {
                if (notif.chat._id === chat._id) ++chatNotifCount;
              });
              return(
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }} key={chat._id}>
                 <List component="nav" aria-label="main mailbox folders">
                 <ChatListItem
                    chat={chat}
                    chatNotifCount={chatNotifCount || ""}
                    typingChatUser={typingChatUsers?.find(
                      (u:any) => u?.toString()?.split("---")[0] === chat._id
                    )}
                    >
                    </ChatListItem>
             
                  </List>
                </Box>
                  )
              })}
            </div>
           ):(
            <>
            <span className="noConversation">
              {chats?.length === 0
                ? `Hi ${
                    truncateString(loggedinUser?.name?.split(" ")[0], 12, 9) ||
                    "There"
                  } 😎`
                : "No Chats Found"}
            </span>
          </>
           )
          }
           </Box> 

        </div>
    );
};

export default ChatList;