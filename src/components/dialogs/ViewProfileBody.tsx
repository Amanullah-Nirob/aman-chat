import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectAppState } from '../../app/slices/AppSlice';
import { selectChildDialogState } from '../../app/slices/ChildDialogSlice';
import { getOneToOneChatReceiver, truncateString } from '../utils/appUtils';
import {Avatar} from '@mui/material'
import { setShowDialogActions } from '../../app/slices/CustomDialogSlice';
import FullSizeImage from '../utils/FullSizeImage';
import ChildDialog from '../utils/ChildDialog';

const ViewProfileBody = ({memberProfilePic,memberName,memberEmail}:any) => {
   const loggedInUser=useAppSelector(selectCurrentUser)
   const {selectedChat}:any=useAppSelector(selectAppState)

   const { childDialogMethods } = useAppSelector(selectChildDialogState);
   const { setChildDialogBody, displayChildDialog } = childDialogMethods;

   let name, email, profilePic;
  if (memberProfilePic && memberName && memberEmail) {
    name = memberName;
    email = memberEmail;
    profilePic = memberProfilePic;
  } else {
    const receiver = getOneToOneChatReceiver(loggedInUser, selectedChat?.users);
    name = receiver?.name;
    email = receiver?.email;
    profilePic = receiver?.profilePic;
  }

  const [showDialogActions, setShowDialogActions] = useState(true);
  const [showDialogClose, setShowDialogClose] = useState(false);

  const displayFullSizeImage = (e:any) => {
    setShowDialogActions(false);
    setShowDialogClose(true);
    setChildDialogBody(<FullSizeImage event={e} />);
    displayChildDialog({
      isFullScreen: true,
      title: e.target?.alt || "Profile Pic",
    });
  };

    return (
        <div className='profileShowDialog'>
          <div className="profileDialogPhoto">
          <Avatar
            src={profilePic}
            alt={name}
            onClick={displayFullSizeImage}
            sx={{width:'280px',height:'0%',border:'2px solid #4395ff'}}
          />
          </div>
          <div className="profileDialogContent">
           <h2>{truncateString(name, 25, 21)}</h2>
           <h3>{truncateString(email, 25, 21)}</h3>
          </div>

        <ChildDialog
        showChildDialogActions={showDialogActions}
        showChildDialogClose={showDialogClose}
      />
        </div>
    );
};

export default ViewProfileBody;