import React from 'react';
import Menu from '../utils/Menu';
import { ListItemIcon, MenuItem } from "@mui/material";
import {AdminPanelSettings,GroupRemove,InfoOutlined,Message,} from "@mui/icons-material";
import { getAxiosConfig, truncateString } from '../utils/appUtils';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { hideDialog } from '../../app/slices/CustomDialogSlice';
import { setLoading } from '../../app/slices/LoadingSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import axios from 'axios';
import { selectAppState, setDeleteNotifsOfChat, setFetchMsgs, setGroupInfo, setSelectedChat, toggleRefresh } from '../../app/slices/AppSlice';
import { displayToast } from '../../app/slices/ToastSlice';
import ViewProfileBody from '../dialogs/ViewProfileBody';

const MemberOptionsMenu = ({anchor,setAnchor,clickedMember,setShowDialogActions,setShowDialogClose,childDialogMethods}:any) => {

  const dispatch=useAppDispatch()
  const loggedinUser=useAppSelector(selectCurrentUser)
  const {refresh, groupInfo, clientSocket, isSocketConnected }:any=useAppSelector(selectAppState)
  const { setChildDialogBody, displayChildDialog } = childDialogMethods;

  const isLoggedInUserGroupAdmin = groupInfo?.groupAdmins?.some(
    (admin:any) => admin?._id === loggedinUser?._id
  );

//   third party ================================================= start
// display error
  const displayError = (error:any,title?:any) => {
    dispatch(
      displayToast({title,message: error.response?.data?.message || error.message,type: "error",duration: 5000,positionVert: "bottom", positionHor: "center",})
    );
  };  



 //clickedMemberName
  const clickedMemberName = truncateString(clickedMember?.name?.split(" ")[0], 12, 9);


// view chat
  const updateView = (data:any) => {
    dispatch(toggleRefresh(!refresh));
    dispatch(setSelectedChat(data));
  };

  const styledMemberName = (
    <span style={{ color: "violet", fontSize: "22px" }}>
      {clickedMemberName}
    </span>
  );
  
//   third party ================================================= end


// create or open chat 1
  const openChat = async () => {
    dispatch(hideDialog()); // Close all dialogs by closing parent dialog
    dispatch(setLoading(true));
    const config = getAxiosConfig({ loggedinUser });
    try {
      const { data } = await axios.post(`${process.env.API_URL}/api/chat`,{ userId: clickedMember?._id },config);

      dispatch(setLoading(false));
      updateView(data);
      dispatch(setFetchMsgs(true));
      dispatch(setDeleteNotifsOfChat(data._id));
    } catch (error) {
      displayError(error, "Couldn't Create/Retrieve Chat");
      dispatch(setLoading(false));
    }
  };

// open profile details 2
  const openViewProfileDialog = () => {
    setShowDialogActions(false);
    setShowDialogClose(true);
    setChildDialogBody(
      <ViewProfileBody
        memberProfilePic={clickedMember?.profilePic}
        memberName={clickedMember?.name}
        memberEmail={clickedMember?.email}
      />
    );
    displayChildDialog({ title: "View Profile" });
  };


//  make admin 3
const makeGroupAdmin= async()=>{
    dispatch(setLoading(true));
    const config = getAxiosConfig({ loggedinUser });
    try {
        const { data } = await axios.post( `${process.env.API_URL}/api/chat/group/make-admin`,{ userId: clickedMember?._id, chatId: groupInfo?._id },config );

        if (isSocketConnected) {
            clientSocket.emit("grp updated", {
                updater: loggedinUser,
                updatedGroup: data,
                createdAdmin: clickedMember,
            });
        }
        dispatch( displayToast({ message: `${clickedMemberName} is now a Group Admin`,type: "success",duration: 4000,positionVert: "bottom",positionHor: "center",}));
        dispatch(setGroupInfo(data));
        updateView(data);
        dispatch(setLoading(false));

    } catch (error) {
      displayError(error, "Make Group Admin Failed");
      dispatch(setLoading(false));
    }
}


//  dismiss admin 4
const dismissAsAdmin=async()=>{
    dispatch(setLoading(true));
    const config = getAxiosConfig({ loggedinUser });
    try {
        const { data } = await axios.put(`${process.env.API_URL}/api/chat/group/dismiss-admin`,{ userId: clickedMember?._id, chatId: groupInfo?._id }, config);
        if (isSocketConnected) {
            clientSocket.emit("grp updated", {
              updater: loggedinUser,
              updatedGroup: data,
              dismissedAdmin: clickedMember,
            });
        }
        dispatch( displayToast({message: `${clickedMemberName} is no longer a Group Admin`,type: "info",duration: 4000, positionVert: "bottom",positionHor: "center"}));
        dispatch(setLoading(false));
        dispatch(setGroupInfo(data));
        updateView(data);
        return "membersUpdated";

    } catch (error) {
      displayError(error, "Dismiss As Group Admin Failed");
      dispatch(setLoading(false));
      return "membersUpdated";
    }
}

// Confirmation dialogs 4
  const openDismissAsAdminConfirmDialog = () => {
    setShowDialogActions(true);
    setShowDialogClose(false);
    setChildDialogBody(<>Are you sure you want to dismiss {styledMemberName} as group admin?</> );
    displayChildDialog({
      title: "Dismiss As Admin",
      nolabel: "NO",
      yeslabel: "YES",
      loadingYeslabel: "Saving...",
      action: dismissAsAdmin,
    });
  };

  const removeFromGroup=async()=>{
    dispatch(setLoading(true));
    const config = getAxiosConfig({ loggedinUser });
    try {
        const { data } = await axios.put(`${process.env.API_URL}/api/chat/group/remove`,
            {
              userToBeRemoved: clickedMember?._id,
              isGroupAdmin: clickedMember?.isGroupAdmin,
              chatId: groupInfo?._id,
            },config
          );
        data["removedUser"] = clickedMember;
        if (isSocketConnected) {
            clientSocket.emit("grp updated", {
              updater: loggedinUser,
              updatedGroup: data,
            });
        }
        dispatch( displayToast({ message: `${clickedMemberName} removed from Group`,type: "info", duration: 4000,positionVert: "bottom",positionHor: "bottom",}));
        dispatch(setLoading(false));
        dispatch(setGroupInfo(data));
        updateView(data);
        return "membersUpdated";
    } catch (error) {
      displayError(error, "Remove From Group Failed");
      dispatch(setLoading(false));
      return "membersUpdated";
    }
  }

  const openRemoveFromGroupConfirmDialog = () => {
    setShowDialogActions(true);
    setShowDialogClose(false);
    setChildDialogBody(
      <>Are you sure you want to remove {styledMemberName} from this group?</>
    );
    displayChildDialog({
      title: "Remove From Group",
      nolabel: "NO",
      yeslabel: "YES",
      loadingYeslabel: "Saving...",
      action: removeFromGroup,
    });
  };

    return (
        <Menu
        menuAnchor={anchor}
        setMenuAnchor={setAnchor}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
{/* Message X */}
      <MenuItem 
      onClick={openChat}
      >
        <ListItemIcon>
          <Message />
        </ListItemIcon>
        <span>{`Message ${clickedMemberName || "Member"}`}</span>
      </MenuItem>
{/* View X */}
      <MenuItem onClick={openViewProfileDialog}>
        <ListItemIcon>
          <InfoOutlined />
        </ListItemIcon>
        <span>{`View ${clickedMemberName || "Member"}`}</span>
      </MenuItem>  
{/* Make Group Admin / Dismiss as Admin */}
      {isLoggedInUserGroupAdmin && (
        <MenuItem
          onClick={clickedMember?.isGroupAdmin ? openDismissAsAdminConfirmDialog: makeGroupAdmin}
        >
          <ListItemIcon>
            <AdminPanelSettings />
          </ListItemIcon>
          <span>
            {clickedMember?.isGroupAdmin? "Dismiss as Admin": "Make Group Admin"}
          </span>
        </MenuItem>
      )}
{/* Remove X */}
      {isLoggedInUserGroupAdmin && (
        <MenuItem onClick={openRemoveFromGroupConfirmDialog}>
          <ListItemIcon >
            <GroupRemove />
          </ListItemIcon>
          <span>{`Remove ${clickedMemberName || "Member"}`}</span>
        </MenuItem>
      )}
    </Menu>
    );
};

export default MemberOptionsMenu;