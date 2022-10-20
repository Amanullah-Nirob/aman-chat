import React, { useEffect, useState } from 'react';
import {BottomNavigation,Badge,BottomNavigationAction,Box} from '@mui/material';

import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';
import { Notifications } from "@mui/icons-material";
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import NotificationMobile from '../drawer/NotificationMobile';
import { selectAppState } from '../../app/slices/AppSlice';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Peoples from '../drawer/Peoples';

const MobileNavigation = ({chats}:any) => {
    const loggedinUser=useAppSelector(selectCurrentUser)
    const [animateNotif, setAnimateNotif] = useState(false);
    const {selectedChat}=useAppSelector(selectAppState)
// notification area start
const notifCount = loggedinUser?.notifications?.length || "";
const nitificationCountArry:any=[]
loggedinUser?.notifications.forEach((notification:any)=>{
  if(nitificationCountArry.indexOf(notification?.sender?._id) ===-1){
    nitificationCountArry.push(notification?.sender?._id)
  }else{
    if(notification?.chat?.isGroupChat){
     nitificationCountArry.push(notification?.sender?._id)
    }
  }
}) 
const nitificationArryCount=nitificationCountArry.length || ""
useEffect(() => {
   if (animateNotif) return;
   setAnimateNotif(true);
   let timeout = setTimeout(() => {
     setAnimateNotif(false);
   }, 1000);
   return () => clearTimeout(timeout);
 }, [nitificationArryCount]);
// notification end

// mobile navigation change
const [changeNav, setChangeNav] = useState('chat');
const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setChangeNav(newValue);
};

// drawer state area
// nitification drawer state
const [openNotification, setOpenNotification] = useState(false);
const handleNotificationDrawerOpen = () => {
  setOpenNotification(true);
  handlePeoplesDrawerClose()
};
const handleNotificationDrawerClose = () => {
  setOpenNotification(false);
};

const [openPeoples, setOpenPeoples] = useState(false);
const handlePeoplesDrawerOpen = () => {
  setOpenPeoples(true);
};
const handlePeoplesDrawerClose = () => {
  setOpenPeoples(false);
};




// all drawer close home back
 const homePageBackAndAllDrawerClose=()=>{
    handleNotificationDrawerClose()
    handlePeoplesDrawerClose()
 }

    return (
    <Box className='mobileNavigation' sx={{display:{xl:'flex', lg:'flex', md:'flex', sm:'flex',xs:selectedChat?'none':'flex'}}}>
{/* home chat */}
     <BottomNavigation sx={{ width: '100%' }} value={changeNav} onChange={handleChange}>

      <BottomNavigationAction onClick={homePageBackAndAllDrawerClose}
        label="Chat" value="chat"
        icon={<ChatIcon />}
      />

{/* notifications */}
      <BottomNavigationAction
        onClick={handleNotificationDrawerOpen}
        label="Notification" value="notification"
        icon={(
            <div className="notification-area mobile" style={{position:'relative'}}>
                  {notifCount && (
                    <Badge badgeContent={notifCount} color="error" className={`${animateNotif ? "notifCountChange" : "" }`}
                      sx={{ top: '-17px', left: '25px'}}
                    >
                    </Badge>
                  )}
                  <Notifications />
            </div>
        )}
      />

{/* peoples */}
      <BottomNavigationAction label="People" value="people"
       onClick={handlePeoplesDrawerOpen}
        icon={<PeopleAltIcon />}
      />


{/* folder */}
      <BottomNavigationAction 
      label="Folder"
       value="folder"  icon={<FolderIcon />} />
    </BottomNavigation>

{/* page drawer */}


{/* notifications page call*/}
<NotificationMobile
    chats={chats}
    open={openNotification}
    handleDrawerClose={handleNotificationDrawerClose}
></NotificationMobile>

  <Peoples
      open={openPeoples}
      handleDrawerClose={handlePeoplesDrawerClose}
  ></Peoples>





        </Box>
    );
};

export default MobileNavigation;