import React from 'react';
import { Box } from '@mui/material';
import { switchTheme,selectTheme } from '../../app/slices/theme/ThemeSlice';
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

const SwitchToggle = () => {

  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme); 

  const handleChange = (_event: any) => {
    dispatch(switchTheme(theme == 'dark' ? 'light' : 'dark'))
 };
    return (
        <Box className='switchButton' onClick={handleChange} sx={{ padding:'5px 8px',cursor:'pointer'}}>
          {theme==='light'?<DarkModeOutlinedIcon sx={{transform: 'translate(0px, 5px)'}} />:<WbSunnyOutlinedIcon sx={{transform: 'translate(0px, 5px)'}}/>}
        </Box>
    );
};

export default SwitchToggle;