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
import EditProfile from '../dialogs/EditProfile';
import SwitchToggle from '../authentication/SwitchToggle';



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
    setDialogBody(<div style={{padding:'15px 27px'}}>Are you sure you want to log out?</div>);
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
   const openEditPasswordDialog=()=>{
    dispatch(setShowDialogActions(false));
    setDialogBody(<ChangePassword></ChangePassword>);
    dispatch(
      displayDialog({
        title: "Change Password"})
    );
   }

  // profile update
  const openEditProfileDialog=()=>{
    dispatch(setShowDialogActions(false));
    setDialogBody(<EditProfile setDialogBody={setDialogBody}/>);
    dispatch(
      displayDialog({
        title: `Edit Profile`,
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
        <MenuItem onClick={openEditProfileDialog}>
        <ListItemIcon> <Avatar src={loggedinUser?.profilePic}></Avatar> </ListItemIcon>
         Edit Profile
        </MenuItem>

        <MenuItem onClick={openEditPasswordDialog}>
        <ListItemIcon> <Key /> </ListItemIcon>
         change password
        </MenuItem>

        <MenuItem>
        <SwitchToggle></SwitchToggle>
        </MenuItem>
   

        <MenuItem onClick={openLogoutConfirmDialog}>
        <ListItemIcon> <Logout fontSize="small" /></ListItemIcon>
          logout
        </MenuItem>

        </Menu>
    );
};

export default ProfileSettings;