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

    const lightTheme = React.useMemo(
        () =>
          createTheme({
            palette: {
              mode,
              background: {
                default: "#fff"
              },
            },
          }),
        [mode],
      );

    const nightTheme = React.useMemo(
        () =>
          createTheme({
            palette: {
              mode,
              background: {
                default: "#000"
              },
            },
          }),
        [mode],
      );

     const {toastData}=useAppSelector(selectToastState)

      
    return (
        <ThemeProvider theme={mode==='light'?lightTheme:nightTheme}>
        <CssBaseline />
            {children}
        <AppToast></AppToast> 
        </ThemeProvider>
    );
};

export default MusterLayout;