// external import
import React, { useEffect, useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { Box,Button,List,ListItemButton,Avatar,IconButton} from '@mui/material';

// internal imports
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import {selectTheme} from '../../app/slices/theme/ThemeSlice'
import LoadingList from '../utils/LoadingList';
import { useGetChatQuery } from '../../app/apisAll/chat';
import { selectAppState, setDeleteNotifsOfChat, setFetchMsgs, setGroupInfo, setSelectedChat,setIsMobile } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { debounce, getAxiosConfig, getOneToOneChatReceiver, truncateString } from '../utils/appUtils';
import ChatListItem from '../utils/ChatListItem';
import axios from 'axios';
import { displayToast } from '../../app/slices/ToastSlice';
import { displayDialog, setShowDialogActions } from '../../app/slices/CustomDialogSlice';
import AddMembersToGroup from '../dialogs/AddMembersToGroup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Slider from 'react-slick';
import { Skeleton } from "@mui/material";
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import { settings } from '../../../utilities/carouselHelpers';
import MainProfileDrawer from '../drawer/MainProfileDrawer';
import { styled, useTheme } from '@mui/material/styles';
import NoConversation from '../elements/NoConversation';
import MobileNavigation from '../mobile/MobileNavigation';




const ChatList = ({chats,setChats,setDialogBody,typingChatUsers}:any) => {
 const theme=useAppSelector(selectTheme)
 const loggedinUser=useAppSelector(selectCurrentUser)
 const [loading, setLoading] = useState(true);
 const dispatch=useAppDispatch()
 const { selectedChat, refresh,onlineUsers, }:any = useAppSelector(selectAppState);
//  const { data, isError, isLoading, isSuccess, error }=useGetChatQuery('')
 const [filteredChats, setFilteredChats] = useState(chats);
 const notifs = [...loggedinUser?.notifications];
 const matches = useMediaQuery('(max-width:600px)');



 const fetchChats= async (onlineUsers:any)=>{
   const config = getAxiosConfig({ loggedinUser });

      try {
       const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, config);
          
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
        if (loading) setLoading(false);

      } catch (error:any) {
         console.log(error);
         dispatch(
          displayToast({ title: "Couldn't Fetch Chats", message: error.response?.data?.message || error.message, type: "error", duration: 5000,positionVert: "bottom",positionHor:'center'})
        );
        if (loading) setLoading(false);
      }
 }

 const activeUsers=filteredChats.filter((users:any)=>users?.isOnline===true)

  
 
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


 // create group area
 const DEFAULT_GROUP_DP = process.env.NEXT_PUBLIC_DEFAULTImage;
const openCreateGroupChatDialog=()=>{
  dispatch(
    setGroupInfo({
      chatDisplayPic: null,
      chatDisplayPicUrl: DEFAULT_GROUP_DP,
      chatName: "",
      users: [],
    })
  );
  dispatch(setShowDialogActions(true));
  setDialogBody(<AddMembersToGroup forCreateGroup={true} />);
  dispatch(
    displayDialog({
      title: "Add Group Members",
      nolabel: "Cancel",
      yeslabel: "Next",
      action: null,
    })
  );

}


// mobile area start
const [open, setOpen] = useState(false);
const handleDrawerOpen = () => {
  dispatch(setIsMobile(true))
  setOpen(true);
};
const handleDrawerClose = () => {
  dispatch(setIsMobile(false))
  setOpen(false);
};





    return (
        <div className='chatListArea-main' style={{borderColor:theme==='light'?'rgb(233 226 226)':'#444242'}}>

          <Box className="chatListHeader" >
{/* header title and search */}
           <div className="headerTitle">
           <div className="titleMain">
             {!matches?<h2>Chat</h2>:(
               <div className='mobileChatTitle'>
                 <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerOpen}
                  sx={{padding:'0',marginRight:'10px'}}
                >
                <Avatar
                 src={loggedinUser?.profilePic}
                 alt={loggedinUser?.name}
                ></Avatar>
                </IconButton>
                <h2 style={{marginLeft:'4px'}}>Chats</h2>
               </div>
             )}
            </div>
          <div className='groupChatCreate' style={{backgroundColor:theme==='light'?'#ddd':'rgba(56, 56, 56, 0.64)'}}onClick={openCreateGroupChatDialog}>
            <Button sx={{borderRadius:'82px',minWidth: '40px',padding:'6px 0',color:theme==='light'?'#000':'#fff'}}>
            <GroupIcon />
            </Button>
          </div>
           </div> 

{/* header search */}
           <div className="headerSearch">
             <input  type="text" placeholder='Search Friends' style={{backgroundColor:theme==='light'?'#f0f2f5':'rgb(56 56 56 / 64%)',color:theme==='light'?'#000':'#eee'}}
              onChange={(e) => searchChats(e)} 
              />
           </div>
{/* active users */}
           <div className="activeUsers">
            <div className='createOthers'>
               <div>
               <Avatar sx={{width:'50px',height:'50px',backgroundColor:theme==='light'?'#d9d9d9':'rgb(56 56 56 / 64%)'}}>
                  <OnlinePredictionIcon sx={{color:theme==='light'?'#000':'#fff'}} />
               </Avatar>
               </div>
               <p>Online Users</p>
            </div>
            <div className="userActiveLists">
            {/* <Slider {...settings}> */}
            <div className='onLineUserMain'>
            {loading? (
              [...Array(9)].map((e, i) => (
                <div key={`loadingListOf${'activeUsers' + i}`} style={{width:'50px'}}>
                  <Skeleton
                    variant="circular"
                    className="loadingDp"
                    style={{ backgroundColor: "#999", width: '49px', height: '49px' }}
                  />
                </div>
                ))
            ):(
             
                 activeUsers?.length > 0 ?(
                      activeUsers.map((activeUser:any)=>(
                        <div className='activeUserItem' key={activeUser._id}
                        onClick={(e:any)=>{
                          const { dataset }:any = e.target;
                          const parentDataset = e.target.parentNode.dataset;
                          const clickedChatId = dataset.chat || parentDataset.chat;
                          const hasNotifs = dataset.hasNotifs || parentDataset.hasNotifs;
                          if (!clickedChatId) return;
                          const clickedChat = filteredChats.find((chat:any) => chat._id === clickedChatId);
                          if (clickedChat._id === selectedChat?._id) return;
                          dispatch(setSelectedChat(clickedChat));
                          dispatch(setFetchMsgs(true));
                          if (clickedChat?.isGroupChat) dispatch(setGroupInfo(clickedChat));
                          if (hasNotifs) dispatch(setDeleteNotifsOfChat(clickedChatId));
                         }}
                        >
                        <IconButton sx={{padding:'0'}}
                        data-chat={activeUser?._id}
                        data-has-notifs={activeUser?.chatNotifCount}
                        >
                        <div className='userAvatar'
                        data-chat={activeUser?._id}
                        data-has-notifs={activeUser?.chatNotifCount}
                        >
                          <Avatar 
                          data-chat={activeUser?._id}
                          data-has-notifs={activeUser?.chatNotifCount}
                           src={activeUser?.chatDisplayPic}
                           alt={activeUser?.chatName}
                           sx={{width:'50px',height:'50px'}}
                          ></Avatar>
                            <span style={{display:activeUser?.isOnline?'block':'none',borderColor:theme==='light'?'#fff':'#000'}} className='activeStatus'></span>
                           </div>
                        </IconButton>
                        <div className='userActiveName'
                         data-chat={activeUser?._id}
                         data-has-notifs={activeUser?.chatNotifCount}
                        >
                          <p>{truncateString(activeUser?.chatName.split(" ")[0] , 5, 5)}</p>
                          <p>{truncateString(activeUser?.chatName.split(" ")[1] , 6, 5)}</p>
                         </div>
    
                        </div>
                       ))
                  ):(
                    ''
                  )
                  

            )
          }
            </div>
            </div>
        </div>
          </Box>
{/* main chat list */}
          <Box className='chatListAreaMain' 
          sx={{ overflow:"auto", scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: matches?'0':'0.4em',
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
                 <List component="nav" aria-label="main mailbox folders" sx={{paddingTop:'0',paddingBottom:{sm:'10px',xs:'6px'}}}>
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
           <NoConversation loggedinUser={loggedinUser} />
          </>
           )
          }
           </Box> 


          <MainProfileDrawer
            setDialogBody={setDialogBody}
            open={open}
            handleDrawerClose={handleDrawerClose}
          ></MainProfileDrawer>
        </div>
    );
};

export default ChatList;