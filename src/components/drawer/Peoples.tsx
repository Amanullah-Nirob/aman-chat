import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import {Box,ListItemButton,CircularProgress} from '@mui/material';
import {Drawer,CssBaseline,IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import { debounce, getAxiosConfig } from '../utils/appUtils';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import axios from 'axios';
import UserListItem from '../elements/UserListItem';
import { setDeleteNotifsOfChat, setFetchMsgs, setSelectedChat } from '../../app/slices/AppSlice';
import { displayToast } from '../../app/slices/ToastSlice';


const drawerWidth = '100%';
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));






const Peoples = ({open,handleDrawerClose}:any) => {
 const loggedinUser=useAppSelector(selectCurrentUser)
 const theme=useAppSelector(selectTheme)
 const dispatch=useAppDispatch()
 const [allUsers,setAllUsers]=useState([])
 const [filterData,setFilterData]=useState([])
  const allChatUsers = async () => {
    const config = getAxiosConfig({ loggedinUser });
    try {
     const {data}= await axios.get(
        `${process.env.API_URL}/api/user/allUsers`,
        config
      );
      setAllUsers(data);
      setFilterData(data)
    } catch (error:any) {
      console.log("Couldn't Delete Notifications : ", error.message);
    }
  };
useEffect(()=>{
 allChatUsers()
},[])

   // Debouncing filterChats method to limit the no. of fn calls
   const searchUsers = debounce((e:any) => {
    const chatNameInput = e.target.value?.toLowerCase().trim();
    if (!chatNameInput) return setFilterData(allUsers);
    setFilterData(
      filterData.filter((user:any) =>
      user?.name?.toLowerCase().includes(chatNameInput)
      )
    );
  }, 600);

// create chat
const createOrRetrieveChat= async (userId:any)=>{
  const config = getAxiosConfig({ loggedinUser });
  try {
      const { data } = await axios.post(`${process.env.API_URL}/api/chat`, { userId }, config);
      dispatch(setSelectedChat(data));
      dispatch(setFetchMsgs(true));
      dispatch(setDeleteNotifsOfChat(data._id));
  } catch (error:any) {
      dispatch(
          displayToast({  title: "Couldn't Create/Retrieve Chat", message: error.response?.data?.message || error.message, type: "error",
            duration: 4000,
            positionVert: "bottom",
            positionHor: "center",
          })
        ); 
  }
}



  return (
 <Box sx={{ display: 'flex' }}>
      <CssBaseline /> 
      <Drawer sx={{ width: drawerWidth,flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth,border:0,height: '91%'}, }} variant="persistent"
        anchor="right"
        open={open}
      >
{/* drawer header */}
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ArrowBackIcon /> 
          </IconButton>
        </DrawerHeader>
{/* main part */}
       <Box sx={{padding:'0 8px'}}>
         {/* header search */}
         <div className="headerSearch">
             <input  type="text" placeholder='Search Chat' style={{backgroundColor:theme==='light'?'#f0f2f5':'rgb(56 56 56 / 64%)',color:theme==='light'?'#000':'#eee'}}
              onChange={(e) => searchUsers(e)} 
              />
          </div>
         <div className="allUsers"
           onClick={(e:any)=>{
            const userId = e.target.dataset.user || e.target.alt;
            console.log(userId);
            if (!userId) return;
            createOrRetrieveChat(userId);
          }}
         >
          {
            filterData.map((user:any)=>(
             <UserListItem
              user={user} truncateValues={[27, 24]} 
              key={user._id} />
            ))
          }
         </div>

       </Box>

      </Drawer>
    </Box>
       
    );
};

export default Peoples;

