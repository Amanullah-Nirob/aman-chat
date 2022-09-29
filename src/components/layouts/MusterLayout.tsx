import React from 'react';
import { ThemeProvider ,createTheme} from '@mui/material/styles';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import { CssBaseline } from '@mui/material';
import AppToast from '../utils/AppToast';
import {selectToastState} from '../../app/slices/ToastSlice'
import { useAppSelector } from '../../app/hooks';
interface LayoutProps {
    children: React.ReactNode;
}

  
const MusterLayout = ({children}:LayoutProps) => {
    const mode = useAppSelector(selectTheme);
    const theme = React.useMemo(
        () =>
          createTheme({
            palette: {
              mode,
            },
          }),
        [mode],
      );

     const {toastData}=useAppSelector(selectToastState)

      
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
            {children}
           <AppToast></AppToast> 
        </ThemeProvider>
    );
};

export default MusterLayout;