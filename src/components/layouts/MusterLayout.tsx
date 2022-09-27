import React from 'react';
import { ThemeProvider ,createTheme} from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../app/theme/ThemeSlice';
import { CssBaseline } from '@mui/material';

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
        </ThemeProvider>
    );
};

export default MusterLayout;