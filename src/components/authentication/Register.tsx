// extarnal imports
import { FC } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

// internal imports
import AuthFormInputs from './AuthFormInputs';
import { useRegisterUserMutation } from '../../app/apisAll/userApi';
import { setLoggedInUser } from '../../app/slices/auth/authSlice';
import { useAppDispatch } from '../../app/hooks';
import { displayToast } from '../../app/slices/ToastSlice';
import {signupSchema} from './authValidSchema'




// Infer the Schema to get TypeScript Type
type ISignUp = TypeOf<typeof signupSchema>;


// tsx elements
const Register: FC = () => {

  //  Default Values
  const defaultValues: ISignUp = { name: '', email: '', password: '',passwordConfirm: ''};
  // Object containing all the methods returned by useForm
  const methods = useForm<ISignUp>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });


  const dispatch=useAppDispatch()
  const [registerUser,{ isLoading, isError, error }]=useRegisterUserMutation()

  // Form Handler
  const onSubmitHandler: SubmitHandler<ISignUp> = async ({name,email,password,passwordConfirm}:ISignUp) => {
     try {
      const user= await registerUser({name,email,password}).unwrap()
     if(user?._id){
      dispatch(
        displayToast({
          title: "Registration Successful",
          message: "Your login session will expire in 15 days",
          type: "success",
          duration: 5000,
          positionVert: "top",
          positionHor: "center",
        })
      );
      dispatch(setLoggedInUser(user))
     }
   } catch (error:any) { 
      dispatch(  
        displayToast({
          title: "Registration Failed",
          message: error?.data.message? error?.data.message : 'Registration Failed',
          type: "error",
          duration: 4000,
          positionVert: "top",
          positionHor: "center",
      }))
       
     }
  };




 return (
   <div className="loginRegister">
            <FormProvider {...methods}>
                  <Box display='flex' flexDirection='column' component='form' noValidate autoComplete='off' onSubmit={methods.handleSubmit(onSubmitHandler)} >

                    <Typography  variant='h6' component='h1' sx={{ textAlign: 'center', mb: '1.5rem' }}>
                      Aman Chat
                    </Typography>

                    <AuthFormInputs label='Name' type='text' name='name' focused required />

                    <AuthFormInputs label='Enter your email' type='email' name='email' focused required />

                    <AuthFormInputs type='password'  label='Password' name='password' required focused />

                    <AuthFormInputs type='password' label='Confirm Password' name='passwordConfirm' required focused />

                    <LoadingButton loading={isLoading?true:false} type='submit' variant='contained'
                      sx={{py: '0.8rem', mt: 2,width: '80%', marginInline: 'auto', }}
                    >
                      Sign Up
                    </LoadingButton>
                  </Box>

                <Stack sx={{ mt: '1rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Already have an account? <Link href='/login'>Login</Link>
                  </Typography>
                </Stack>
            </FormProvider>
   </div>
  );
};

export default Register;