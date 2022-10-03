import React,{useState,useEffect} from 'react';
import {Box,Button,Avatar} from '@mui/material'
import Image from 'next/image';
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { displayDialog,hideDialog,setShowDialogActions } from '../../app/slices/CustomDialogSlice';
import CropEasy from './CropEasy';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';

const EditProfile = ({setDialogBody}:any) => {
    const dispatch=useAppDispatch()
    const loggedinUser=useAppSelector(selectCurrentUser)
    const theme=useAppSelector(selectTheme)


  const handleChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(setShowDialogActions(false));
      setDialogBody(<CropEasy photoURL={URL.createObjectURL(file)}  />);
      dispatch(
        displayDialog({
          title: `Crop Profile Photo`,
        })
      );

    }
  };

  


    return (
        <Box style={{width:'500px'}}>
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
            <div className='profile-content'>
             <h2>{loggedinUser?.name}</h2>
             <h4>{loggedinUser?.email}</h4>
            </div>
           </div>
        </Box>
    );
};

export default EditProfile;