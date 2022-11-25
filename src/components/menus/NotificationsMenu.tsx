
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
        <h3 style={{margin: '4px 13px 5px'}}>All Notifications</h3>
       <NotificationList chats={chats}></NotificationList>
       </div>
    </Menu>
    );
};

export default NotificationsMenu;