// external imports
import React,{useState} from 'react';
import { InputAdornment, IconButton,Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TypeOf } from 'zod';
import LoadingButton from '@mui/lab/LoadingButton';

// internal imports
import AuthFormInputs from '../authentication/AuthFormInputs';
import { updatePasswordSchema } from '../authentication/authValidSchema';


// Infer the Schema to get TypeScript Type
type ISignUp = TypeOf<typeof updatePasswordSchema>;


const ChangePassword = () => {

  // Default Values
  const defaultValues: ISignUp = { curentpassword:'', password: '',passwordConfirm: ''};
  // Object containing all the methods returned by useForm
  const methods = useForm<ISignUp>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues,
  });


  
  const onSubmitHandler: SubmitHandler<ISignUp> = async ({curentpassword,password,passwordConfirm}:ISignUp) =>{
      console.log({curentpassword,password,passwordConfirm});
      
  }


    const [values, setValues] = useState({ showPassword: false});
    const handleClickShowPassword = () => { setValues({ showPassword: !values.showPassword })};
    

    return (
        <FormProvider {...methods}>
         <Box display='flex' flexDirection='column' component='form' noValidate autoComplete='off' onSubmit={methods.handleSubmit(onSubmitHandler)} sx={{marginTop:'18px'}}>

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
                    <LoadingButton loading={false} type='submit' variant='contained'
                      sx={{py: '0.8rem', mt: 2,width: '20%', marginInline: 'auto', }}>
                     Save
                    </LoadingButton>

         </Box>
        </FormProvider>
    );
};

export default ChangePassword;