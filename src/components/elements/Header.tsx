import Image from 'next/image';
import React,{ useEffect, useRef, useState} from 'react';
import logo from '../../../public/static/images/favi.png'
import { useAppSelector } from '../../app/hooks';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import SearchIcon from '@mui/icons-material/Search';
import Router from 'next/router';
import Link from 'next/link';
import {selectCurrentUser} from '../../app/slices/auth/authSlice'
import UserListItem from './UserListItem';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import {Avatar,IconButton} from '@mui/material';
import ProfileSettings from '../menus/ProfileSettings';



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

 
const Header = ({setDialogBody}:any) => {
 const theme=useAppSelector(selectTheme)
 const loggedinUser=useAppSelector(selectCurrentUser)
 const inputEl = useRef(null);
 const [isSearch, setIsSearch] = useState(false);
 const [keyword, setKeyword] = useState('');
 const [searchResult, setSearchResult] = useState<any | null>(null);
 const [loading, setLoading] = useState(false);
 const debouncedSearchTerm = useDebounce(keyword, 300);
 const [profileSettingsMenuAnchor, setProfileSettingsMenuAnchor] = useState<any | null>(null);


 useEffect(() => {
  if (debouncedSearchTerm) {
      setLoading(true);
      if (keyword) {
          fetch(`${process.env.API_URL}/api/user?search=${keyword}`,{
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
        productItemsView = <p>No product found.</p>;
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





    return (
     <header className='header' style={{backgroundColor:theme==='light'?'#fff':'transparent',boxShadow:theme==='light'?'rgb(66 66 66 / 6%) 0px 4px 6px -1px, rgb(0 0 0 / 6%) 0px 2px 4px -1px':'',borderColor:theme==='light'?'transparent':'#303030'}}>
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
                    placeholder='Search' style={{backgroundColor:theme==='light'?'#f0f2f5':'#3b3b3b',color:theme==='light'?'#000':'#fff'}}
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
                }}>{productItemsView}</div>

            </div>
        </form>
      </div>

      <div className='right-area'>
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
    </header>
    );
};

export default Header;


