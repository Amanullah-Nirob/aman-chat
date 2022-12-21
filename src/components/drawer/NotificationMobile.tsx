
import React from 'react';
import { styled } from '@mui/material/styles';
import {Box,ListItemButton} from '@mui/material';
import {Drawer,CssBaseline,IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import  Router  from 'next/router';
import NotificationList from '../utils/NotificationList';
import { useAppSelector } from '../../app/hooks';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';


const drawerWidth = '100%';
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));



const NotificationMobile = ({open,chats}:any) => {
  const theme=useAppSelector(selectTheme)
  return (
 <Box sx={{ display: 'flex' }}>
      <CssBaseline /> 
      <Drawer
        sx={{ width: drawerWidth,flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth,border:0,height: '92%',backgroundColor:theme==='light'?'#fff':'#000'}, }}
        variant="persistent"
        anchor="right"
        open={open}
      >
{/* main part */}
       <Box sx={{padding:'0 8px'}}>
       <h3 style={{margin: '4px 13px 5px',padding:'8px 0'}}>All Notifications</h3>
        <NotificationList chats={chats}></NotificationList>
       </Box>

      </Drawer>
    </Box>
       
    );
};

export default NotificationMobile;