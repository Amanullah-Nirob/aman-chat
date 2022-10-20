// external impprts
import React,{useState} from 'react';
import { Box, Button, DialogActions, DialogContent, Slider,Typography} from '@mui/material';
import Cropper from 'react-easy-crop'
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveIcon from '@mui/icons-material/Save';

// enternal imports
import getCroppedImg from '../utils/cropImage'
import { hideDialog, setShowDialogActions,displayDialog } from '../../app/slices/CustomDialogSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { isImageFile,TWO_MB } from '../utils/appUtils';
import { displayToast } from '../../app/slices/ToastSlice';
import { useProfilePhotoUpdateMutation } from '../../app/apisAll/userApi';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { setLoggedInUser } from '../../app/slices/auth/authSlice';
import EditProfile from './EditProfile';
import MainProfileDrawer from '../drawer/MainProfileDrawer';
import { selectAppState } from '../../app/slices/AppSlice';

const CropEasy = ({photoURL,setDialogBody}:any) => {

  
const dispatch=useAppDispatch()
const loggedInUser=useAppSelector(selectCurrentUser)
const {isMobile}=useAppSelector(selectAppState)
const [profilePhotoUpdate,{isLoading,error,isError}]=useProfilePhotoUpdateMutation()


const displayWarning = (message = "Warning", duration = 3000) => {
  dispatch(
    displayToast({
      message,
      type: "warning",
      duration,
      position: "top-center",
    })
  );
};

const displaySuccess = (message:string) => {
  dispatch(
    displayToast({
      message,
      type: "success",
      duration: 3000,
      positionVert: "top",
      positionHor:'center'
    })
  );
};


const handleBack=()=>{
  dispatch(setShowDialogActions(false));
  setDialogBody(<EditProfile setDialogBody={setDialogBody} />);
  dispatch(
    displayDialog({
      title: `Edit Profile`,
    })
  );
}


    const [crop, setCrop] = useState<any | null>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<any | null>(1);
    const [rotation, setRotation] = useState<any | null>(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any | null>(null);
    const [uploading,setUploading]=useState<Boolean | null>(false)

    const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const cropImage = async () => {
        try {
          const { file, url }:any = await getCroppedImg(
            photoURL,
            croppedAreaPixels,
            rotation
          );
          if (!isImageFile(file.name)) {
            return dispatch(
              displayToast({  title: "Invalid Image File",  message: "Please Select an Image File (png/jpg/jpeg/svg/webp)",type: "warning", duration: 3000, position: "bottom-center"})
            );
          }
          if (file.size >= TWO_MB) {
            return displayWarning("Please Select an Image Smaller than 2 MB", 4000);
          }
         setUploading(true)
         const formData = new FormData();
         formData.append("profilePic", file);
         formData.append("currentProfilePic", loggedInUser?.profilePic);
         formData.append("cloudinary_id", loggedInUser?.cloudinary_id);

          const {data}:any=await profilePhotoUpdate(formData)
          if(data._id){
            const updateUser={
              ...data,
              token: loggedInUser.token,
              expiryTime: loggedInUser.expiryTime,
            }
            dispatch(setLoggedInUser(updateUser));
            displaySuccess("ProfilePic Updated Successfully");
            setUploading(false)
            dispatch(hideDialog())
          }
        } catch (error) {
          console.log(error);
        }
    };




   return (
    <Box>
      <DialogContent
        dividers
        sx={{
          background: '#333',
          position: 'relative',
          height: isMobile?350 : 400,
          width: isMobile?'325px':'auto',
          minWidth: { sm: 500, },
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay="auto"
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </Box>
          <Box>
            <Typography>Rotation: {rotation + '°'}</Typography>
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={360}
              value={rotation}
              onChange={(e, rotation) => setRotation(rotation)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >

          {isMobile?'':(
            <Button
            variant="outlined"
            startIcon={<ArrowBackIosIcon />}
            onClick={handleBack}
            disabled={uploading?true:false} >
             Back
            </Button>
          )
          }
           

      

          <LoadingButton
            variant="contained"
            loading={uploading?true:false}
            startIcon={<SaveIcon />}
            onClick={cropImage}>Save
          </LoadingButton>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default CropEasy;

const zoomPercent = (value:any) => {
    return `${Math.round(value * 100)}%`;
  };
  