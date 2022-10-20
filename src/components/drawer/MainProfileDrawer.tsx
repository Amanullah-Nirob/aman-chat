import React from 'react';
import { styled } from '@mui/material/styles';
import {Box,ListItemButton} from '@mui/material';
import {Drawer,CssBaseline,IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditProfile from '../dialogs/EditProfile';
import SwitchToggle from '../authentication/SwitchToggle';
import { ListItemIcon, MenuItem,Avatar } from "@mui/material";
import {Key,Logout } from '@mui/icons-material';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ChangePassword from '../dialogs/ChangePassword';
import { useAppDispatch } from '../../app/hooks';
import { displayDialog, setShowDialogActions } from '../../app/slices/CustomDialogSlice';
import { setLoggedInUser } from '../../app/slices/auth/authSlice';
import  Router  from 'next/router';


const drawerWidth = '100%';
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));


 


const MainProfileDrawer = ({open,handleDrawerClose,setDialogBody}:any) => {

   const dispatch=useAppDispatch()


    // update password 
    const openEditPasswordDialog=()=>{
      dispatch(setShowDialogActions(false));
      setDialogBody(<ChangePassword></ChangePassword>);
      dispatch(
        displayDialog({
          title: "Change Password"})
      );
    }
// logout
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


  return (
 <Box sx={{ display: 'flex' }}>
      <CssBaseline /> 
      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth,border:0}, }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ArrowBackIcon /> 
          </IconButton>
        </DrawerHeader>

{/* profile area */}
        <Box>
          <EditProfile
           setDialogBody={setDialogBody}
          ></EditProfile>
        </Box>

{/* main part*/}
     <Box sx={{padding:'0 17px'}}>
{/* dark mode switch */}
        <ListItemButton sx={{padding:'0'}} >
         <div className="darkModeSwitch">
         <SwitchToggle></SwitchToggle>
         </div>
         </ListItemButton>

        <ListItemButton sx={{padding:'0'}} onClick={openEditPasswordDialog}>
          <div className='changePassword'>
          <div className='changePassIcon'> 
          <SettingsSuggestIcon /> 
        </div>
          <div className="changPassTxt">
            <p>change password</p>
            <p>......</p>
          </div>
          </div>
     
        </ListItemButton>

        <ListItemButton sx={{padding:'0'}} onClick={openLogoutConfirmDialog}>
          <div className="logout-area">
            <div className="logoutIcon">
              <Logout />
            </div>
            <p>Logout</p>
          </div>
     
        </ListItemButton>



       </Box>
      </Drawer>
    </Box>
       
    );
};

export default MainProfileDrawer;