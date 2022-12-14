import { Avatar, ListItemButton } from "@mui/material";
import { truncateString,useHover } from "../../components/utils/appUtils";
import * as React from 'react';
import { selectTheme } from "../../app/slices/theme/ThemeSlice";
import { useAppSelector } from '../../app/hooks';
import { selectAppState } from "../../app/slices/AppSlice";


interface props{
  user:{
    _id:string,
    name:string,
    email:string,
    profilePic:string,
  },
  truncateValues:[
    max:number,
    index:number
  ]
}

const UserListItem = ({ user, truncateValues }:props) => {
  const { _id, name, email, profilePic } = user;
  const [max, index] = truncateValues;
  const {isMobile}=useAppSelector(selectAppState)
  const theme=useAppSelector(selectTheme)

  
  const hover = useHover({backgroundColor: theme==='light'?'#e3e4e5':'#18191a', userSelect: "none"})
  
  
  return (
    <ListItemButton data-user={_id} className='user-list-area'{...hover}>
       <div className="userPhoto">
       <Avatar src={profilePic}  alt={_id} data-user={_id} />
       </div>
      <div data-user={_id} className='user-Info'>
        <p data-user={_id} className='userName'>
          {truncateString(name, max, index)}
        </p>
        {!isMobile&&
            <p data-user={_id} className='userEmail'>
            {truncateString(email, max, index)}
            </p>
        }
       
      </div>
    </ListItemButton>

  );
};

export default UserListItem;
