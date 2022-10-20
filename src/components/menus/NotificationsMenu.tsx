
import React from 'react';
import Menu from '../utils/Menu';
import NotificationList from '../utils/NotificationList';

const NotificationsMenu = ({chats,anchor,setAnchor}:any) => {
    return (
    <Menu
        menuAnchor={anchor}
        setMenuAnchor={setAnchor}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
       <div className="notificationUserList">
       <NotificationList chats={chats}></NotificationList>
       </div>
        </Menu>
    );
};

export default NotificationsMenu;