import React from 'react';
import { ThemeProvider ,createTheme} from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import { CssBaseline } from '@mui/material';
import AppToast from '../utils/AppToast';

interface LayoutProps {
    children: React.ReactNode;
}

  
const MusterLayout = ({children}:LayoutProps) => {
    const mode = useSelector(selectTheme);

    const theme = React.useMemo(
        () =>
          createTheme({
            palette: {
              mode,
            },
          }),
        [mode],
      );

      
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
            {children}
            <AppToast></AppToast>
        </ThemeProvider>
    );
};

export default MusterLayout;