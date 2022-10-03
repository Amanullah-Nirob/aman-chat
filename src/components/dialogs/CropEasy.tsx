// external impprts
import React,{useState} from 'react';
import { Cancel } from '@mui/icons-material';
import CropIcon from '@mui/icons-material/Crop';
import { Box, Button, DialogActions, DialogContent, Slider,Typography} from '@mui/material';
import Cropper from 'react-easy-crop'
import { hideDialog } from '../../app/slices/CustomDialogSlice';
import { useAppDispatch } from '../../app/hooks';
// enternal imports
import getCroppedImg from '../utils/cropImage'



const CropEasy = ({photoURL}:any) => {
const dispatch=useAppDispatch()

    const [crop, setCrop] = useState<any | null>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<any | null>(1);
    const [rotation, setRotation] = useState<any | null>(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any | null>(null);
    

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
          console.log(file);
        } catch (error) {
          console.log(error);
        }
    };


   return (
    <>
      <DialogContent
        dividers
        sx={{
          background: '#333',
          position: 'relative',
          height: 400,
          width: 'auto',
          minWidth: { sm: 500 },
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
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => dispatch(hideDialog())}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<CropIcon />}
            onClick={cropImage}
          >
            Crop
          </Button>
        </Box>
      </DialogActions>
    </>
  );
};

export default CropEasy;

const zoomPercent = (value:any) => {
    return `${Math.round(value * 100)}%`;
  };
  