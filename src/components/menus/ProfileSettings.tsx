import React from 'react';
import Menu from '../utils/Menu';
import { ListItemIcon, MenuItem,Avatar } from "@mui/material";
import {Key,Logout } from '@mui/icons-material';
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { displayDialog,hideDialog,setShowDialogActions} from '../../app/slices/CustomDialogSlice';
import { setLoggedInUser } from '../../app/slices/auth/authSlice';
import Router from 'next/router';
import ChangePassword from '../dialogs/ChangePassword';

const ProfileSettings = ({anchor,setAnchor,setDialogBody}:any) => {
  const loggedinUser=useAppSelector(selectCurrentUser)
  const dispatch=useAppDispatch()
  
  
  // logout area
  const logout=()=>{
    dispatch(setLoggedInUser(null))
    Router.push('/')
    console.log(`log out successfully`);
    return "loggingOut";
  }
  const openLogoutConfirmDialog=()=>{
    dispatch(setShowDialogActions(true));
    setDialogBody(<>Are you sure you want to log out?</>);
    dispatch(
      displayDialog({
        title: "Logout Confirmation",
        nolabel: "NO",
        yeslabel: "YES",
        loadingYeslabel: "Logging Out...", 
        action: logout,
      })
    );
  }
  // logout area end


// update password
const updatePassword=()=>{
  console.log(`update password comming soon`);
  dispatch(hideDialog());
}
   const openEditPasswordDialog=()=>{
    dispatch(setShowDialogActions(true));
    setDialogBody(<ChangePassword></ChangePassword>);
    dispatch(
      displayDialog({
        title: "Change Password",
        nolabel: "CANCEL",
        yeslabel: "SAVE",
        loadingYeslabel: "Saving...",
        action: updatePassword,
      })
    );
   }

    return (
        <Menu 
          menuAnchor={anchor}
          setMenuAnchor={setAnchor}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
        <MenuItem>
        <ListItemIcon> <Avatar src={loggedinUser?.profilePic}></Avatar> </ListItemIcon>
         Edit Profile
        </MenuItem>

        <MenuItem onClick={openEditPasswordDialog}>
        <ListItemIcon> <Key /> </ListItemIcon>
         change password
        </MenuItem>

        <MenuItem onClick={openLogoutConfirmDialog}>
        <ListItemIcon> <Logout fontSize="small" /></ListItemIcon>
          logout
        </MenuItem>

        </Menu>
    );
};

export default ProfileSettings;