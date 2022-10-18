import { Avatar,ListItemButton,Button } from '@mui/material';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAppState } from '../../app/slices/AppSlice';
import { truncateString } from './appUtils';
import { KeyboardArrowDown } from "@mui/icons-material";
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const GroupMemberItem = ({ user, truncateValues }:any) => {
    const loggedInUser:any  = useAppSelector(selectCurrentUser);
    const { _id, name, email, profilePic } = user;
    const [max, index] = truncateValues;
    const isLoggedInUser = _id === loggedInUser?._id;

    return (
        <ListItemButton
         data-user={_id}
         className={`groupMemberItem`}>
{/* admin Badge */}
      {user?.isGroupAdmin && (
        <span className='adminBadge'>
          Admin
        </span>
      )}

      {!isLoggedInUser && (
        <Button
          sx={{minWidth:'0px'}}
          data-user={_id}
          className="memberSettingsIcon"
        >
          <MoreVertIcon data-user={_id} />
        </Button>
      )}

        <Avatar
          src={profilePic}
          alt={_id}
          data-user={_id}
          className={`listItemAvatar groupMemberAvatar`}
        />

      <div data-user={_id} className="groupMemberData">
        <p data-user={_id} className="groupMemberName">
          {isLoggedInUser ? "You" : truncateString(name, max, index)}
        </p>
        <p data-user={_id} className="groupMemberEmail">
          {truncateString(email, max, index)}
        </p>
      </div>

      </ListItemButton>
    );
};

export default GroupMemberItem;