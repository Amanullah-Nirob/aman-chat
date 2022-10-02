import React from 'react';
import { Menu as MuiMenu } from "@mui/material";


export const menuPaperProps = {
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5,
      '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  };

const Menu = ({children, menuAnchor,setMenuAnchor, transformOrigin,anchorOrigin}:any) => {
    const isMenuOpen = Boolean(menuAnchor);
    const closeMenu = () => setMenuAnchor(null);


    return (
     <MuiMenu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={closeMenu}
        onClick={closeMenu}
        PaperProps={menuPaperProps}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
      >
        {children}
      </MuiMenu>
    );
};

export default Menu;