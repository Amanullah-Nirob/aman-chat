import React,{useState,useEffect} from 'react';
import {Box,Button,Avatar} from '@mui/material'
import Image from 'next/image';
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectCurrentUser, setLoggedInUser } from '../../app/slices/auth/authSlice';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { displayDialog,hideDialog,setShowDialogActions } from '../../app/slices/CustomDialogSlice';
import CropEasy from './CropEasy';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { selectChildDialogState } from '../../app/slices/ChildDialogSlice';
import ChildDialog from '../utils/ChildDialog';
import TextField from '@mui/material/TextField';
import { displayToast } from '../../app/slices/ToastSlice';
import { setLoading,selectLoadingState } from '../../app/slices/LoadingSlice';
import { useProfileNameUpdateMutation } from '../../app/apisAll/userApi';
import LoadingButton from '@mui/lab/LoadingButton';
import { selectAppState } from '../../app/slices/AppSlice';
import { isImageFile, TWO_MB } from '../utils/appUtils';


const EditProfile = ({setDialogBody}:any) => {
    const dispatch=useAppDispatch()
    const loggedinUser=useAppSelector(selectCurrentUser)
    const theme=useAppSelector(selectTheme)
    const {childDialogMethods}:any=useAppSelector(selectChildDialogState)
    const {setChildDialogBody,displayChildDialog,closeChildDialog}=childDialogMethods
    const loading =useAppSelector(selectLoadingState)
    const {isMobile}=useAppSelector(selectAppState)
    
  const displayWarning = (message = "Warning", duration = 3000) => {
    dispatch(
      displayToast({
        message,
        type: "warning",
        duration,
        positionVert: "top",
        positionHor:'center'
      })
    );
  };
  const displaySuccess = (message:string) => {
    dispatch(
      displayToast({
        message,
        type: "success",
        duration: 2000,
        positionVert: "top",
        positionHor:'center'
      })
    );
  };
  const displayError = (message:string) => {
    dispatch(
      displayToast({
        message,
        type: "error",
        duration: 3000,
        positionVert: "top",
        positionHor:'center'
      })
    );
  };
  
// photo update 
  const handleChange = (e:any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isImageFile(file.name)) {
      return dispatch(
        displayToast({
          title: "Invalid Image File",
          message: "Please Select an Image File (png/jpg/jpeg/svg/webp)",
          type: "warning",
          duration: 5000,
          positionVert: "bottom",
          positionHor: "center",
        })
      );
    }
    if (file.size >= TWO_MB) {
      return displayWarning("Please Select an Image Smaller than 2 MB", 4000);
    }

    if (file) {
      dispatch(setShowDialogActions(false));
      setDialogBody(<CropEasy photoURL={URL.createObjectURL(file)} setDialogBody={setDialogBody} />);
      dispatch(
        displayDialog({ 
          title: `Crop Profile Photo`,
        })
      );

    }
  };
 
  // update name
  const [editName,setEditName]=useState(false)
  const [name,setName]=useState(loggedinUser.name)
  const [profileNameUpdate,{isLoading,error,isError}]=useProfileNameUpdateMutation()

  const handleUpdateName=async(e: { preventDefault: () => void; })=>{
    e.preventDefault()
    if (!name) return displayWarning("Please Enter a Valid Name");
     try {
        const {data}:any=await profileNameUpdate({newUserName:name})
        if(!isError && data?._id){
          const updateUser={
            ...data,
            token: loggedinUser.token,
            expiryTime: loggedinUser.expiryTime,
          }
          dispatch(setLoggedInUser(updateUser));
          setEditName(false)
        }
        
     } catch (error) {
      console.log(error);
     }
  }



    return (
        <Box sx={{width:{xs:'100%',sm:'500px'},padding:'4px 24px 21px'}}>
           <div className="profile-area" style={{display:'flex',flexDirection:isMobile?'column':'row'}}>
           <div className='profile-Image'>
           <Avatar  alt="Profile Photo" sx={{  width: isMobile?95:106, height:isMobile?95:106 }} 
            src={loggedinUser?.profilePic}
           >
           </Avatar>

            <div className="profile-img-icon" style={{backgroundColor:theme==='light'?'#d8dfda':'#18191a',right:isMobile?'-11px':'0',bottom:isMobile?'-10px':'0'}}>
            <label htmlFor="profilePhoto">
            <input accept="image/*" id="profilePhoto" type="file" style={{ display: 'none' }}
              onChange={handleChange}
            />
             <CameraAltIcon />
            </label>
            </div>
            </div>
            {!editName ? 
               <div className='profile-content' style={{width:isMobile?'':'55%',textAlign:isMobile?'center':'start',lineHeight:isMobile?'23px':'none',marginTop:isMobile?'8px':'0'}}>
               <div>
               <h2>{loggedinUser?.name}</h2>
               <h4>{loggedinUser?.email}</h4>
               </div>
                <Box sx={{marginTop:{xs:'5px',sm:'12px',transform:isMobile?'translate(21px, 3px)':''}}} onClick={()=>setEditName(true)}>
                <ModeEditIcon />
                </Box>
              </div>
              :
              <div className='editNameFrom' style={{marginTop:isMobile?'15px':'0'}}>
                <form onSubmit={handleUpdateName}>
                <TextField variant="outlined" defaultValue={name} onChange={(e:any)=>setName(e.target.value)}/>

                <div style={{textAlign:"end",marginTop:'6px'}}>
                <Button onClick={()=>setEditName(false)}>Cancel</Button>
                <LoadingButton loading={isLoading?true:false} type='submit'  >save</LoadingButton>
                </div>
                </form>
              </div>
            }
         
           </div>
        </Box>
    );
};

export default EditProfile;