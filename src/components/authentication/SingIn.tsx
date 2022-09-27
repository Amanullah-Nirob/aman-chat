import React,{FC,useState} from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Stack,
    Link as MuiLink,
    FormControlLabel,
    Dialog,
    Button,
    styled,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthFormInputs from './AuthFormInputs';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';
import Register from './Register';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


// 👇 Login Schema with Zod
const loginSchema = object({
    email: string().min(1, 'Email is required').email('Email is invalid'),
    password: string()
      .min(1, 'Password is required')
      .min(3, 'Password must be more than 3 characters')
      .max(32, 'Password must be less than 32 characters'),
  });
  
  // 👇 Infer the Schema to get the TS Type
  type ILogin = TypeOf<typeof loginSchema>;


  
const SingIn:FC= () => {

  // ====================== login area ============================
  // Default Values
  const defaultValues: ILogin = {
    email: '',
    password: '',
  };

  // The object returned from useForm Hook
  const methods = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  // Submit Handler
  const onSubmitHandler: SubmitHandler<ILogin> = (values: ILogin) => {
    console.log(values);
  };

// =================================== login area end =========================

const theme = useTheme();
const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
const [open, setOpen] = useState(false);
const handleClickOpen = () => {
  setOpen(true);
};
const handleClose = () => {
  setOpen(false);
};



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

    return (
      <>
          <FormProvider {...methods}>
                  <Box
                    display='flex'
                    flexDirection='column'
                    component='form'
                    noValidate
                    autoComplete='off'
                    sx={{ marginTop: '40px' }}
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >


                    <AuthFormInputs
                      label='Enter your email'
                      type='email'
                      name='email'
                      focused
                      required
                    />
                    <AuthFormInputs
                      type='password'
                      label='Password'
                      name='password'
                      required
                      focused
                    />
                     
                    <LoadingButton
                      loading={false}
                      type='submit'
                      variant='contained'
                      sx={{
                        py: '0.8rem',
                        mt: 2,
                        width: '80%',
                        marginInline: 'auto',
                      }}
                    >
                      Login
                    </LoadingButton>
                  </Box>


                <Stack sx={{ mt: '1rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                  <Button onClick={handleClickOpen}>
                  new user? Register 
                  </Button>
                  </Typography>
                </Stack>
          </FormProvider>


      <BootstrapDialog
     fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
      <BootstrapDialogTitle onClose={handleClose} id={''}>
     Register
    </BootstrapDialogTitle>
     <Register></Register>
      </BootstrapDialog>
      </>
      

    );
};

export default SingIn;