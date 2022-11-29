import { Avatar,Box,TextField,Button,CircularProgress ,ListItemButton} from '@mui/material';
import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAppState, setGroupInfo, setSelectedChat, toggleRefresh } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectChildDialogState } from '../../app/slices/ChildDialogSlice';
import { selectLoadingState, setLoading } from '../../app/slices/LoadingSlice';
import { displayToast } from '../../app/slices/ToastSlice';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { getAxiosConfig, isImageFile, truncateString, TWO_MB } from '../utils/appUtils';
import axios from 'axios';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {
  Delete,
  Edit,
  InfoOutlined,
  Logout,
  PersonAdd,
} from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import ViewGroupMembers from './ViewGroupMembers';
import ChildDialog from '../utils/ChildDialog';
import AddMembersToGroup from './AddMembersToGroup';
import { hideDialog } from '../../app/slices/CustomDialogSlice';
import GroupsIcon from '@mui/icons-material/Groups';

const GroupInfoBody = ({messages}:any) => {
    const {refresh, groupInfo, clientSocket, isSocketConnected }:any= useAppSelector(selectAppState);
    const loggedinUser =useAppSelector(selectCurrentUser)
    const { childDialogMethods } = useAppSelector(selectChildDialogState);
    const { loading, disableIfLoading } = useAppSelector(selectLoadingState);
    const dispatch = useAppDispatch();
    const { setChildDialogBody, displayChildDialog, closeChildDialog }=childDialogMethods;


    const groupDP = groupInfo?.chatDisplayPic;
    const groupName = groupInfo?.chatName;
    const groupMembers = groupInfo?.users;
    const admins = groupInfo?.groupAdmins;

    const [uploading, setUploading] = useState(false);
    const [editGroupDpMenuAnchor, setEditGroupDpMenuAnchor] = useState(null);
    const isUserGroupAdmin = admins?.some((admin:any) => admin?._id === loggedinUser?._id);

    const [showDialogActions, setShowDialogActions] = useState(true);
    const [showDialogClose, setShowDialogClose] = useState(false);
    const [editName,setEditName]=useState(false)
    const [name,setName]=useState(groupName)

    const displayWarning = (message:any, duration?:any) => {
        dispatch(displayToast({message,type: "warning",duration, positionVert: "top", positionHor: "center",}));
    };

    const displayError = (error:any, title:any) => {
        dispatch( displayToast({title,message: error.response?.data?.message || error.message,type: "error",duration: 5000,positionVert: "top", positionHor: "center"}));
    };
    
    const displaySuccess = (message = "Operation Successful") => {
        dispatch( displayToast({message,type: "success", duration: 3000,positionVert: "bottom", positionHor: "center"}));
    };

    const updateView = (data:any) => {
        dispatch(setGroupInfo(data));
        dispatch(toggleRefresh(!refresh));
        dispatch(setSelectedChat(data)); // To update messages view
    };

// update group image photo 1
    const updateGroupDp=async(e:any)=>{
        const image = e.target.files[0];
        if (!image) return;
        if (!isImageFile(image.name)) {
            return dispatch(
                 displayToast({ title: "Invalid Image File",message: "Please Select an Image File (png/jpg/jpeg/svg/webp)",type: "warning",duration: 5000, positionVert: "bottom", positionHor: "center",})
        )}

        if (image.size >= TWO_MB) {
            return displayWarning("Please Select an Image Smaller than 2 MB", 4000);
        }
        dispatch(setLoading(true));
        setUploading(true);
        const config = getAxiosConfig({ loggedinUser, formData: true });

        try {
            const formData = new FormData();
            formData.append("displayPic", image);
            formData.append("currentDP", groupDP);
            formData.append("cloudinary_id", groupInfo?.cloudinary_id);
            formData.append("chatId", groupInfo?._id);
            const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/group/update-dp`,formData,config);
            if (isSocketConnected) {
                clientSocket.emit("grp updated", {
                  updater: loggedinUser,
                  updatedGroup: data,
                });
            }
            displaySuccess("Group DP Updated Successfully");
            dispatch(setLoading(false));
            setUploading(false);
            updateView(data);
        } catch (error) {
            displayError(error, "Couldn't Delete Group DP");
            dispatch(setLoading(false));
        }



    }

 // update group name 2
 const updateGroupName=async(e: { preventDefault: () => void; },options?:any)=>{
    e.preventDefault()
    if (!name) return displayWarning("Please Enter Valid Group Name");
    dispatch(setLoading(true));
    const config = getAxiosConfig({ loggedinUser });
    try {
        const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/group/update-name`,
         { groupName: name, chatId: groupInfo?._id },config
        );
        if (isSocketConnected) {
            clientSocket.emit("grp updated", {
              updater: loggedinUser,
              updatedGroup: data,
            });
        }
        displaySuccess("Group Name Updated Successfully");
        dispatch(setLoading(false));
        updateView(data);
        setEditName(false)
    } catch (error) {
        displayError(error, "Couldn't Update Group Name");
        dispatch(setLoading(false));
    }
 }   

// view member 3
 const openViewMembersDialog = () => {
  setShowDialogActions(false);
  setShowDialogClose(true);
  setChildDialogBody(<ViewGroupMembers />);
  displayChildDialog({
    title: ``,
  });
};

  // To retreive added members from `AddMembersToGroup` dialog 4
  let addedMembers:any = [];
  const getAddedMembers = (updatedMembers:any) => {
    addedMembers = updatedMembers;
  };
 //  addMembersToGroup main function 4
  const addMembersToGroup=async()=>{
    if (!isUserGroupAdmin)
    return displayWarning("Only Admin Can Add Members to Group");
    if (!addedMembers?.length)
    return displayWarning("Please Select Atleast 1 Member to Add");

    dispatch(setLoading(true));
    const config = getAxiosConfig({ loggedinUser });
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/group/add`,
        {
          usersToBeAdded: JSON.stringify(addedMembers),
          chatId: groupInfo?._id
        },
        config
      );
      if (isSocketConnected) {
        clientSocket.emit("grp updated", {
          updater: loggedinUser,
          updatedGroup: data,
        });
      }
      displaySuccess("Successfully Added Member/s to Group");
      dispatch(setLoading(false));
      updateView(data);
      return "profileUpdated";
    } catch (error) {
      displayError(error, "Couldn't Add Members to Group");
      dispatch(setLoading(false));
    }
  }

// Open Add members dialog 4
  const openAddMembersDialog = () => {
    setShowDialogActions(true);
    setShowDialogClose(false);
    setChildDialogBody(<AddMembersToGroup getAddedMembers={getAddedMembers} />);
    displayChildDialog({
      title: "Add Group Members",
      nolabel: "Cancel",
      yeslabel: "Add",
      loadingYeslabel: "Adding...",
      action: addMembersToGroup,
    });
  };


const deleteGroup=async()=>{
  dispatch(setLoading(true));
  const config = getAxiosConfig({ loggedinUser });
  try {
    const deleteGroupPromise = axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/group/delete`,
      {
        currentDP: groupInfo?.chatDisplayPic,
        cloudinary_id: groupInfo?.cloudinary_id,
        chatId: groupInfo?._id,
      },
      config
    );
    const deleteMessagesPromise = messages?.length
    ? axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/message/delete`,
        {
          messageIds: JSON.stringify(messages?.map((m:any) => m._id)),
          isDeleteGroupRequest: true,
        },
        config
      )
    : Promise.resolve();

    // Parallel execution of independent promises
    await Promise.all([deleteGroupPromise, deleteMessagesPromise]);

    if (isSocketConnected) {
      clientSocket.emit("grp deleted", {
        admin: loggedinUser,
        deletedGroup: groupInfo,
      });
    }
    displaySuccess("Group Deleted Successfully");
    dispatch(setLoading(false));
    updateView(null);
    dispatch(hideDialog());
  } catch (error) {
    displayError(error, "Couldn't Delete Group");
    dispatch(setLoading(false));
  }
} 


// open Delete Group Confirm Dialog 5
  const openDeleteGroupConfirmDialog = () => {
    setShowDialogActions(true);
    setShowDialogClose(false);
    setChildDialogBody(
      <>
        All messages and files related to this group will be deleted and this
        group will be removed from the chats of ALL MEMBERS. Are you sure you
        want to delete this group?
      </>
    );
    displayChildDialog({
      title: "Delete Group",
      nolabel: "NO",
      yeslabel: "YES",
      loadingYeslabel: "Deleting...",
      action: deleteGroup,
    });
  };



// exit group 6
const exitGroup=async()=>{
  if (groupMembers?.length === 1) return deleteGroup();

  dispatch(setLoading(true));
  const config = getAxiosConfig({ loggedinUser });

  try {
    const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/group/remove`,
      {
        userToBeRemoved: loggedinUser?._id,
        isGroupAdmin: isUserGroupAdmin,
        chatId: groupInfo?._id,
      },
      config
    );
    if (isSocketConnected) {
      clientSocket.emit("grp updated", {
        updater: loggedinUser,
        updatedGroup: data,
      });
    }
    dispatch(displayToast({ message: `Exited From '${data?.chatName}' Group`,type: "info", duration: 4000, positionVert: "bottom", positionHor: "center",}));
    dispatch(setLoading(false));
    updateView(null);
    dispatch(hideDialog());
  } catch (error:any) {
    dispatch(
      displayToast({ title: "Couldn't Exit Group",
        message: error.response?.data?.message || error.message, type: "error", duration: 4000, positionVert: "bottom", positionHor: "bottom",
      })
    );
    dispatch(setLoading(false));
    return "membersUpdated";
  }

}
// Open confirm dialogs 6
  const openExitGroupConfirmDialog = () => {
    setShowDialogActions(true);
    setShowDialogClose(false);
    setChildDialogBody(
      <>
        {groupMembers?.length === 1
          ? `Since you're the only group member, this group will be 
            DELETED if you exit. Are you sure you want to exit?`
          : `This group will be removed from your chats. 
             Are you sure you want to exit this group?`}
      </>
    );
    displayChildDialog({
      title: "Exit Group",
      nolabel: "NO",
      yeslabel: "YES",
      loadingYeslabel: "Exiting...",
      action: exitGroup,
    });
  };



    return (
        <Box className="groupDialog">
{/* updating group photo */}
        {uploading? (
        <div className='uploadingProgress' >
         <CircularProgress  />
        </div>) :(
            <div className="groupPhotoUpdate">
            <Avatar src={groupDP} sx={{width:'160px',height:'160px'}} />
                <div className="profileImageIcon">
                <label htmlFor="updateGroupPhoto">
                <input accept="image/*" id="updateGroupPhoto" type="file" style={{ display: 'none' }}
                  onChange={updateGroupDp}
                />
                <CameraAltIcon />
                </label>
                </div>
            </div>
        ) }
{/* updating group Name */}
      <div className="groupNameEdit">
         {!editName ? 
               <div className='updateGPName' style={{position:'relative'}}>
               <div>
               <h2>{truncateString(groupName, 25, 21)}</h2>
               </div>
                <Box onClick={()=>setEditName(true)} sx={{position:'absolute',right:'-47px',bottom:'0px'}}>
                <ModeEditIcon />
                </Box>
              </div>
              :
              <div className='editUpdateNameFrom'>
                <form onSubmit={updateGroupName}>
                <TextField variant="outlined" defaultValue={name} onChange={(e:any)=>setName(e.target.value)}/>
                <div style={{textAlign:"end",marginTop:'6px'}}>
                <Button onClick={()=>setEditName(false)}>Cancel</Button>
                <LoadingButton loading={loading?true:false} type='submit'>Save</LoadingButton>
                </div>
                </form>
              </div>
            }
      </div>
{/* number of Group */}
      <div style={{ marginBottom: "12px",color:'green',fontWeight:'bold'}}>
        {`${groupMembers?.length} Member${groupMembers?.length > 1 ? "s" : ""}`}
      </div>

<div className='groupActionButtons'>
{/* View Members */}
<div className={`dialogField`} onClick={openViewMembersDialog}>
        <ListItemButton>
          <GroupsIcon sx={{ marginLeft: "-4px" }}/>
          <span style={{marginLeft:'12px'}}>View Members</span>
        </ListItemButton>
      </div>
{/* add member */}
      <div className={`dialogField`} onClick={openAddMembersDialog}>
        <ListItemButton>
          <PersonAdd sx={{ marginLeft: "-4px" }}/>
          <span style={{marginLeft:'12px'}}>Add Members</span>
        </ListItemButton>
      </div>
{/* Exit group */}
      <div className={`dialogField`}
         onClick={()=>{ 
          if (
            isUserGroupAdmin &&
            admins?.length === 1 &&
            groupMembers?.length !== 1
          ){
            return displayWarning(
              `Every group must have atleast 1 admin. Since 
               you're the only group admin, you won't be allowed
               to exit until you make someone else as the admin.`,
              10000
            );
          }

          openExitGroupConfirmDialog();
         }}
      >
          <ListItemButton>
                <Logout sx={{ marginLeft: "-4px" }}/>
                <span style={{marginLeft:'12px'}}>Exit Group</span>
           </ListItemButton>
    </div>
{/* Delete Group (only for admins) */}
        {isUserGroupAdmin && (
            <div className={`dialogField`}
            onClick={openDeleteGroupConfirmDialog}
            >
          <ListItemButton>
              <Delete sx={{ marginLeft: "-4px" }}/>
              <span style={{marginLeft:'12px'}}>Delete Group</span>
            </ListItemButton>
          </div>
        )}
</div>






     {/* Child dialog */}
     <ChildDialog
        showChildDialogActions={showDialogActions}
        showChildDialogClose={showDialogClose}
      />
        </Box>
    );
};

export default GroupInfoBody;