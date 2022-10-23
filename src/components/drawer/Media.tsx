import React from 'react';
import { styled } from '@mui/material/styles';
import {Box,ListItemButton} from '@mui/material';
import {Drawer,CssBaseline,IconButton} from '@mui/material';


const drawerWidth = '100%';
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const Media = ({open}:any) => {
    return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline /> 
        <Drawer
          sx={{ width: drawerWidth,flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth,border:0,height: '91%'}, }}
          variant="persistent"
          anchor="right"
          open={open}
        >
      {/* main part */}
         <Box sx={{padding:'0 8px'}}>
         <h3 style={{margin: '4px 13px 5px',padding:'8px 0'}}>Media Coming Soon</h3>
         </Box>
  
        </Drawer>
      </Box>
    );
};

export default Media;