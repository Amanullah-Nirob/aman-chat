import Image from 'next/image';
import React,{ Component, useEffect, useRef, useState} from 'react';
import logo from '../../../public/static/images/favi.png'
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import SearchIcon from '@mui/icons-material/Search';
import Router from 'next/router';
import Link from 'next/link';
import {selectCurrentUser} from '../../app/slices/auth/authSlice'
import UserListItem from './UserListItem';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import {Avatar,IconButton,Badge,Box} from '@mui/material';
import ProfileSettings from '../menus/ProfileSettings';
import { getAxiosConfig } from '../utils/appUtils';
import { setLoading } from '../../app/slices/LoadingSlice'
import axios from 'axios'
import { selectAppState, setDeleteNotifsOfChat, setFetchMsgs, setSelectedChat } from '../../app/slices/AppSlice';
import { displayToast } from '../../app/slices/ToastSlice';
import { Notifications } from "@mui/icons-material";
import NotificationsMenu from '../menus/NotificationsMenu';
import SwitchToggle from '../authentication/SwitchToggle';


function useDebounce(value:string, delay:number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
          setDebouncedValue(value);
      }, delay);

      return () => {
          clearTimeout(handler);
      };
  }, [value, delay]);

  return debouncedValue;
}

 
const Header = ({setDialogBody,chats}:any) => {
 const dispatch=useAppDispatch()
 const theme=useAppSelector(selectTheme)
 const loggedinUser=useAppSelector(selectCurrentUser)
 const inputEl = useRef(null);
 const [isSearch, setIsSearch] = useState(false);
 const [keyword, setKeyword] = useState('');
 const [searchResult, setSearchResult] = useState<any | null>(null);
 const [loading, setLoading] = useState(false);
 const debouncedSearchTerm = useDebounce(keyword, 300);
 const [profileSettingsMenuAnchor, setProfileSettingsMenuAnchor] = useState<any | null>(null);
 const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState(null);
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

 const openNotificationMenu = (e:any) => setNotificationsMenuAnchor(e.target);

 useEffect(() => {
    if (animateNotif) return;
    setAnimateNotif(true);
    let timeout = setTimeout(() => {
      setAnimateNotif(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [nitificationArryCount]);

// notification area end


// search area =========================================
 useEffect(() => {
  if (debouncedSearchTerm) {
      setLoading(true);
      if (keyword) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user?search=${keyword}`,{
              headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${loggedinUser.token}` },
          }).then(res=>res.json())
          .then(data=>{
              if(data){
                  setLoading(false);
                  setSearchResult(data);
                  setIsSearch(true);
              }
          })   
      } else {
          setIsSearch(false);
          setKeyword('');
      }
      if (loading) {
          setIsSearch(false);
      }
  } else {
      setLoading(false);
      setIsSearch(false);
  }
}, [debouncedSearchTerm]);


 function handleClearKeyword() {
  setKeyword('');
  setIsSearch(false);
  setLoading(false);
}


  // Views
  let productItemsView,
  clearTextView,
  loadingView
  if (!loading) {
    if (searchResult && searchResult.length > 0) {
        productItemsView = searchResult.map((user:any) => (
            <UserListItem 
             user={user}   truncateValues={[27, 24]} 
             key={user._id} />
        ));
    } else {
        productItemsView = <p>No User found.</p>;
    }
    if (keyword !== '') {
        clearTextView = (
            <span className="form-action" onClick={handleClearKeyword}>
             <CloseIcon sx={{color:theme==='light'?'#222':'#eee'}} />
            </span>
        );
    }
} else {
  loadingView = (
      <span className="form-action spin">
         <CircularProgress size="18px" />
      </span>
  );
}


// create chat
const createOrRetrieveChat= async (userId:any)=>{
    handleClearKeyword()
    const config = getAxiosConfig({ loggedinUser });
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { userId }, config);
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
     <Box className='header' sx={{
      backgroundColor:theme==='light'?'#fff':'transparent',
      boxShadow:theme==='light'?'rgb(66 66 66 / 6%) 0px 4px 6px -1px, rgb(0 0 0 / 6%) 0px 2px 4px -1px':'',
      borderColor:theme==='light'?'transparent':'#303030',
      display:{xl:'flex', lg:'flex', md:'flex', sm:'flex',xs:selectedChat?'none':'flex'}
    }}
     
     >
      <div className='left-area'>
        <div className="logo">
          <Image src={logo} layout='fill'></Image>
        </div>
        <form className="search-area-main">
            <div className="search-input">    
            <input
                    ref={inputEl}
                    type="text"
                    value={keyword}
                    placeholder='Search Any One' style={{backgroundColor:theme==='light'?'#f0f2f5':'rgb(56 56 56 / 64%)',color:theme==='light'?'#000':'#fff'}}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {clearTextView}
                {loadingView}
            </div>

            <div className={`search-result${ isSearch ? ' active ' : ''}`}
             style={{
             backgroundColor:theme==='light'?'#fff':'#242526',
             boxShadow:theme==='light'?'rgb(0 0 0 / 16%) 1px 5px 9px':'rgb(0 0 0 / 16%) 1px 5px 9pxx'
             }}>

                <div className="userListMain"
                   onClick={(e:any)=>{
                    const userId = e.target.dataset.user || e.target.alt;
                    console.log(userId);
                    if (!userId) return;
                    createOrRetrieveChat(userId);
                }}>{productItemsView}</div>

            </div>
        </form>
        
      </div>
{/* header right area */}
    <div className='right-area'>

    <div className='darkModeSwitch' style={{marginBottom:'4px'}}>
    <SwitchToggle></SwitchToggle>
    </div>

      <div className="notification-area" style={{position:'relative'}}>
      <IconButton
            onClick={openNotificationMenu}
          >
            {notifCount && (
              <Badge badgeContent={notifCount} color="error" className={`${animateNotif ? "notifCountChange" : "" }`}
                sx={{ top: '-10px', left: '25px'}}
              >
              </Badge>
            )}
            <Notifications />
        </IconButton>

      </div>



      <div className="profile-area">
      <IconButton sx={{ color: "#999999",marginRight:'15px'}} onClick={(e) => setProfileSettingsMenuAnchor(e.target)}>
            <Avatar alt="LoggedInUser" src={loggedinUser?.profilePic}  />
     </IconButton>
      </div>
      </div>
     <ProfileSettings
         anchor={profileSettingsMenuAnchor}
         setAnchor={setProfileSettingsMenuAnchor}
         setDialogBody={setDialogBody}
     ></ProfileSettings>

    <NotificationsMenu 
      chats={chats}
      anchor={notificationsMenuAnchor}
      setAnchor={setNotificationsMenuAnchor}
    />
    </Box>
    );
};

export default Header;


