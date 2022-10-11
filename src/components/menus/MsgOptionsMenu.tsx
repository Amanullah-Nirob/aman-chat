import React from 'react';
import { Delete, Edit } from "@mui/icons-material";
import { ListItemIcon, MenuItem } from "@mui/material";
import Menu from "../utils/Menu";


const MsgOptionsMenu = ({anchor,setAnchor,clickedMsg,editMsgHandler,openDeleteMsgConfirmDialog}:any) => {

    return (
    <Menu
        menuAnchor={anchor}
        setMenuAnchor={setAnchor}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem onClick={editMsgHandler}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <span>Edit Message</span>
        </MenuItem>
        <MenuItem onClick={openDeleteMsgConfirmDialog}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <span>Delete Message</span>
        </MenuItem>
      </Menu>
    );
};

export default MsgOptionsMenu;