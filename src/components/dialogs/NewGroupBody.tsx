import { Edit,KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { Box } from '@mui/material';
import Image from 'next/image';
import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAppState, setGroupInfo, toggleRefresh } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectLoadingState, setLoading } from '../../app/slices/LoadingSlice';
import { displayToast } from '../../app/slices/ToastSlice';
import { getAxiosConfig, isImageFile, TWO_MB } from '../utils/appUtils';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Avatar,TextField,Button, CircularProgress, DialogActions  } from '@mui/material';
import axios from 'axios';
import { hideDialog } from '../../app/slices/CustomDialogSlice';


const NewGroupBody = ({closeChildDialog}:any) => {
    const loggedinUser=useAppSelector(selectCurrentUser)
    const {refresh, groupInfo, clientSocket, isSocketConnected}:any=useAppSelector(selectAppState)
    const { chatDisplayPicUrl, chatName }:any = groupInfo;
    const {disableIfLoading,loading} =useAppSelector(selectLoadingState)
    const dispatch=useAppDispatch()
    const imgInput = useRef();
// Click a button/icon upon 'Enter' or 'Space' keydown
  const clickOnKeydown = (e:any) => {
    if (e.key === " " || e.key === "Enter") e.target.click();
  };

  const displayWarning = (message = "Warning", duration?:number) => {
    dispatch(
      displayToast({
        message,
        type: "warning",
        duration,
        positionVert: "top",
        positionHor: "center",
      })
    );
  };





  const handleImgInputChange = (e:any) => {
    const image = e.target.files[0];
    if (!image) return;

    if (!isImageFile(image.name)) {
      return dispatch(
        displayToast({
          title: "Invalid Image File",
          message: "Please Select an Image File (png/jpg/jpeg/svg/webp)",
          type: "warning",
          duration: 5000,
          positionVert: "top",
          positionHor: "center",
        })
      );
    }

    if (image.size >= TWO_MB) {
      return displayWarning("Please Select an Image Smaller than 2 MB", 4000);
    }
    dispatch(
      setGroupInfo({
        ...groupInfo,
        chatDisplayPic: image,
        chatDisplayPicUrl: URL.createObjectURL(image),
      })
    );
  };



// create group area -------------------------
const createGroupChat=async()=>{
    if (!groupInfo) return;
    const { chatDisplayPic, chatName, users }:any = groupInfo;
    if (!chatName) return displayWarning("Please Enter a Group Name");
    
    if (users?.length < 2)
      return displayWarning("Please Add Atleast 2 Members");
      dispatch(setLoading(true));
    const config = getAxiosConfig({ loggedinUser, formData: true });
    try {
        const formData = new FormData();
        formData.append("displayPic", chatDisplayPic);
        formData.append("chatName", chatName);
        formData.append("users", JSON.stringify(users?.map((user:any) => user?._id)));
        const { data } = await axios.post(`${process.env.API_URL}/api/chat/group`, formData, config);
        if (isSocketConnected) {
            clientSocket.emit("new grp created", {
              admin: loggedinUser,
              newGroup: data,
            });
        }
        dispatch( displayToast({ message: "Group Created Successfully",type: "success",duration: 2000, positionVert: "bottom",positionHor:'center'}));
        dispatch(setLoading(false));
        dispatch(toggleRefresh(!refresh));
        closeChildDialog();
       // Close Parent Dialog as well
      dispatch(hideDialog());
    } catch (error:any) {
        dispatch(displayToast({ title: "Couldn't Create Group",   message: error.response?.data?.message || error.message,  type: "error", duration: 5000,positionVert: "top",positionHor:'center'}));
    }


}


    return (
        <Box className="newGroup" sx={{width:{sm:'clamp(230px, 55vw, 300px)',xs:'clamp(230px, 76vw, 300px)'}}}>
          <div className='groupCrtImage'>
          <Avatar src={chatDisplayPicUrl} sx={{width:'200px',height:'200px'}}></Avatar>
            <div className="profileImageIcon">
            <label htmlFor="profilePhoto">
            <input accept="image/*" id="profilePhoto" type="file" style={{ display: 'none' }}
              onChange={handleImgInputChange}
            />
             <CameraAltIcon />
            </label>
           </div>
          </div>
          <div className='groupName'>
            <TextField label="Group Name" variant="outlined" 
            defaultValue={chatName}
            onChange={(e:any) => {
                dispatch(setGroupInfo({ ...groupInfo, chatName: e.target.value }));
            }}
            disabled={loading}
            />
          </div>
     
          <DialogActions className="mt-3" style={{ marginBottom: "-17px" }}>
        <Button
          disabled={loading}
          onClick={closeChildDialog}
        >
          <span style={{display:'flex',alignItems:'center'}}>
            <KeyboardDoubleArrowLeft
              className="btnArrowIcons"
              style={{ margin: "0px 5px 2px 0px", }}
            />
            Back
          </span>
        </Button>
        <Button
          disabled={loading}
          onClick={createGroupChat}
        >
          {loading ? (
            <>
              <CircularProgress size={25} style={{ marginRight: "10px" }} />
              <span>Creating...</span>
            </>
          ) : (
            <>Create Group</>
          )}
        </Button>
      </DialogActions>


        </Box>
    );
};

export default NewGroupBody;