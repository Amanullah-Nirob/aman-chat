
import React from 'react';
import { styled } from '@mui/material/styles';
import {Box,ListItemButton} from '@mui/material';
import {Drawer,CssBaseline,IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import  Router  from 'next/router';
import NotificationList from '../utils/NotificationList';


const drawerWidth = '100%';
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));



const NotificationMobile = ({open,handleDrawerClose,chats}:any) => {

  return (
 <Box sx={{ display: 'flex' }}>
      <CssBaseline /> 
      <Drawer
        sx={{ width: drawerWidth,flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth,border:0,height: '91%'}, }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ArrowBackIcon /> 
          </IconButton>
        </DrawerHeader>
{/* main part */}
       <Box sx={{padding:'0 8px'}}>
        <NotificationList chats={chats}></NotificationList>
       </Box>

      </Drawer>
    </Box>
       
    );
};

export default NotificationMobile;