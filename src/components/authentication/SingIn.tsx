// external imports
import React,{FC,useState} from 'react';
import { Box, Typography,Stack,Dialog,Button,styled,DialogTitle,IconButton, InputAdornment,} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// internal imports
import AuthFormInputs from './AuthFormInputs';
import Register from './Register';
import { loginSchema } from './authValidSchema';
import {useLoginMutation} from '../../app/apisAll/userApi'
import {useAppDispatch} from '../../app/hooks'
import { displayToast } from '../../app/slices/ToastSlice';
import { setLoggedInUser } from '../../app/slices/auth/authSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// 👇 Infer the Schema to get the TS Type
type ILogin = TypeOf<typeof loginSchema>;

  
const SingIn:FC= () => {


const dispatch=useAppDispatch()
//  register modal 
const theme = useTheme();
const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
const [open, setOpen] = useState(false);

const handleClickOpen = () => {setOpen(true);};
const handleClose = () => {setOpen(false);};

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
 // >>>>>> model end


  // Default Values
  const defaultValues: ILogin = { email: '', password: ''};
  // The object returned from useForm Hook
  const methods = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  // registration  
  const [login,{ isLoading, isError, error }] = useLoginMutation()
  // Submit Handler
  const onSubmitHandler: SubmitHandler<ILogin> = async ({email,password}: ILogin) => {
    try {
        const user = await login({email,password}).unwrap();
        if(user?._id){
          dispatch(
            displayToast({ title: "Registration Successful", message: "Your login session will expire in 15 days",type: "success", duration: 5000, positionVert: "top",
              positionHor: "center",
            }));
          dispatch(setLoggedInUser(user))
         }
    } catch (error:any) {
      dispatch(  
        displayToast({ title: "login Failed",  message: error?.data.message? error?.data.message : 'login Failed',type: "error", duration: 4000,
        positionVert: "top", 
        positionHor: "center",
      }))
    }
  };

  // password show
  const [values, setValues] = useState({ showPassword: false});
  const handleClickShowPassword = () => setValues({ showPassword: !values.showPassword});

 

    return ( 
      <>
        <FormProvider {...methods}>
              <Box display='flex' flexDirection='column' component='form' noValidate autoComplete='off' sx={{ marginTop: '40px' }}
                   onSubmit={methods.handleSubmit(onSubmitHandler)}
               >
                    <AuthFormInputs label='Enter your email' type='email' name='email' focused required />
                    <AuthFormInputs  type={values.showPassword ? 'text' : 'password'}  
                      InputProps = {
                        {
                          endAdornment:(
                            <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" >
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                         )
                        }
                      }
                      label='Password' name='password' required focused
                      />

                    <LoadingButton loading={isLoading?true:false} type='submit' variant='contained'
                      sx={{ py: '0.8rem',mt: 2, width: '80%',marginInline: 'auto'}}> Login
                    </LoadingButton>
              </Box>

                <Stack sx={{ mt: '1rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                  <Button onClick={handleClickOpen}> new user? Register </Button>
                  </Typography>
                </Stack>
        </FormProvider>

    <BootstrapDialog fullScreen={fullScreen} onClose={handleClose} aria-labelledby="customized-dialog-title"open={open}>
    <BootstrapDialogTitle onClose={handleClose} id={''}>Aman Chat</BootstrapDialogTitle>
    {/* reguster form  */}
     <Register></Register>
  </BootstrapDialog>
      </>
      

    );
};

export default SingIn;