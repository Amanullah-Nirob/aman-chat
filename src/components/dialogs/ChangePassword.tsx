// external imports
import React,{useState} from 'react';
import { InputAdornment, IconButton,Box,Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf } from 'zod';
import LoadingButton from '@mui/lab/LoadingButton';


// internal imports
import AuthFormInputs from '../authentication/AuthFormInputs';
import { updatePasswordSchema } from '../authentication/authValidSchema';
import { useAppDispatch } from '../../app/hooks';
import {hideDialog} from '../../app/slices/CustomDialogSlice'
import { displayToast } from '../../app/slices/ToastSlice';
import {usePasswordUpdateMutation} from '../../app/apisAll/userApi'
import { setLoggedInUser } from '../../app/slices/auth/authSlice';
import Router  from 'next/router';

// Infer the Schema to get TypeScript Type
type ISignUp = TypeOf<typeof updatePasswordSchema>;


const ChangePassword = () => {
  const dispatch=useAppDispatch()
  const [passwordUpdate,{isLoading,isError,error}]=usePasswordUpdateMutation()


  const displayWarning = (message = "Warning", duration = 3000) => {
    dispatch(
      displayToast({
        message,
        type: "warning",
        duration,
        positionVert: "top",
        positionHor:'center'
      })
    );
  };
  const displaySuccess = (message:string) => {
    dispatch(
      displayToast({
        message,
        type: "success",
        duration: 4000,
        positionVert: "top",
        positionHor:'center'
      })
    );
  };

  // Default Values
  const defaultValues: ISignUp = { curentpassword:'', password: '',passwordConfirm: ''};
  // Object containing all the methods returned by useForm
  const methods = useForm<ISignUp>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues,
  });


  
  const onSubmitHandler: SubmitHandler<ISignUp> = async ({curentpassword,password,passwordConfirm}:ISignUp) =>{
    if (curentpassword === password) {
      return displayWarning("New Password Must Differ from Current Password");
    }
    try {
     await passwordUpdate({currentPassword:curentpassword,newPassword:password}).unwrap()
        displaySuccess( "Password Updated Successfully. Please Login Again with Updated Password");
        dispatch(setLoggedInUser(null))
        dispatch(hideDialog());
        Router.push('/')

    } catch (error:any) {
       dispatch(  
        displayToast({ title: "Password Update Failed",  message: error?.data?.message? error?.data?.message : 'Password Update Failed',type: "error", duration: 4000,
        positionVert: "top", 
        positionHor: "center",
      }))
      console.log(error);
      
    }
      
  }


    const [values, setValues] = useState({ showPassword: false});
    const handleClickShowPassword = () => { setValues({ showPassword: !values.showPassword })};
    

    return (
        <FormProvider {...methods}>
         <Box display='flex' flexDirection='column' component='form' noValidate autoComplete='off' onSubmit={methods.handleSubmit(onSubmitHandler)} sx={{marginTop:'18px',padding:'15px 27px'}}>

                 <AuthFormInputs type={values.showPassword ? 'text' : 'password'} 
                      InputProps = {{endAdornment:(
                        <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                          </InputAdornment>
                      )}} label='Curent Password' name='curentpassword' required focused />
                      
                   <AuthFormInputs type={values.showPassword ? 'text' : 'password'} 
                      InputProps = {{endAdornment:(
                        <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                          </InputAdornment>
                      )}} label='New Password' name='password' required focused />

                    <AuthFormInputs type={values.showPassword ? 'text' : 'password'} 
                      InputProps = {{
                        endAdornment:(
                            <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                        )}} label='New Confirm Password' name='passwordConfirm' required focused />

                 <Box  sx={{ '& > *': { m: 1,},textAlign:'end'}}>
                <Button onClick={()=>dispatch(hideDialog())}   sx={{py: '0.8rem', mt: 2,width: '20%', marginInline: 'auto', }}>cencel</Button>

                <LoadingButton loading={isLoading?true:false} type='submit'
                      sx={{py: '0.8rem', mt: 2,width: '20%', marginInline: 'auto', }}>
                     Save
                 </LoadingButton>
                 </Box>
         </Box>
        </FormProvider>
    );
};

export default ChangePassword;