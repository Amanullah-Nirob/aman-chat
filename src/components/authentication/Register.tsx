import { FC } from 'react';
import { Container, Grid, Box, Typography, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthFormInputs from './AuthFormInputs';
import Link from 'next/link';

// SignUp Schema with Zod
const signupSchema = object({
  name: string().min(1, 'Name is required').max(70),
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(3, 'Password must be more than 3 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

// Infer the Schema to get TypeScript Type
type ISignUp = TypeOf<typeof signupSchema>;



const Register: FC = () => {
  //  Default Values
  const defaultValues: ISignUp = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };


  // Object containing all the methods returned by useForm
  const methods = useForm<ISignUp>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  // Form Handler
  const onSubmitHandler: SubmitHandler<ISignUp> = (values: ISignUp) => {
    console.log(JSON.stringify(values, null, 4));
  };



 return (
   <div className="loginRegister">
            <FormProvider {...methods}>
                  <Box
                    display='flex'
                    flexDirection='column'
                    component='form'
                    noValidate
                    autoComplete='off'
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >
                    <Typography
                      variant='h6'
                      component='h1'
                      sx={{ textAlign: 'center', mb: '1.5rem' }}
                    >
                    Aman Chat
                    </Typography>

                    <AuthFormInputs
                      label='Name'
                      type='text'
                      name='name'
                      focused
                      required
                    />
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
                    <AuthFormInputs
                      type='password'
                      label='Confirm Password'
                      name='passwordConfirm'
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
                      Sign Up
                    </LoadingButton>
                  </Box>

                <Stack sx={{ mt: '1rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Already have an account? <Link href='/'>Login</Link>
                  </Typography>
                </Stack>

            </FormProvider>

   </div>
    );
};

export default Register;