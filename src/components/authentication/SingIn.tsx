import {FC} from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Stack,
    Link as MuiLink,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthFormInputs from './AuthFormInputs';
import styled from '@emotion/styled';
import Link from 'next/link';


//Styled React Next Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

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






    return (
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

                    <FormControlLabel
                      control={
                        <Checkbox
                          size='small'
                          aria-label='trust this device checkbox'
                          required

                        />
                      }
                      label={
                        <Typography
                          variant='body2'
                          sx={{
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            color: '#5e5b5d',
                          }}
                        >
                          Remember me
                        </Typography>
                      }
                      
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
                    Need an account?{' '}
                    <LinkItem href='/register'>Sign up</LinkItem>
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    Forgot your{' '}
                    <LinkItem href='/forgotPassword'>password?</LinkItem>
                  </Typography>
                </Stack>

          </FormProvider>
    );
};

export default SingIn;