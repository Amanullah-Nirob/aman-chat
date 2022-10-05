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


const EditProfile = ({setDialogBody}:any) => {
    const dispatch=useAppDispatch()
    const loggedinUser=useAppSelector(selectCurrentUser)
    const theme=useAppSelector(selectTheme)
    const {childDialogMethods}:any=useAppSelector(selectChildDialogState)
    const {setChildDialogBody,displayChildDialog,closeChildDialog}=childDialogMethods
    const loading =useAppSelector(selectLoadingState)

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
          displaySuccess("Name Updated Successfully");
          setEditName(false)
        }
        
     } catch (error) {
      console.log(error);
     }
  }



    return (
        <Box sx={{width:{xs:'100%',sm:'500px'},padding:'4px 24px 21px'}}>
           <div className="profile-area">
           <div className='profile-Image'>
           <Avatar  alt="Profile Photo" sx={{ width: 106, height: 106 }} >
           <Image src={loggedinUser?.profilePic} layout='fill' /> 
           </Avatar>

            <div className="profile-img-icon" style={{backgroundColor:theme==='light'?'#d8dfda':'#18191a'}}>
            <label htmlFor="profilePhoto">
            <input accept="image/*" id="profilePhoto" type="file" style={{ display: 'none' }}
              onChange={handleChange}
            />
             <CameraAltIcon />
            </label>
            </div>

            </div>
            {!editName ? 
               <div className='profile-content'>
               <div>
               <h2>{loggedinUser?.name}</h2>
               <h4>{loggedinUser?.email}</h4>
               </div>
                <Box sx={{marginTop:{xs:'5px',sm:'12px'}}} onClick={()=>setEditName(true)}>
                <ModeEditIcon />
                </Box>
              </div>
              :
              <div className='editNameFrom'>
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