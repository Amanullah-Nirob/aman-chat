import { object, string, TypeOf } from 'zod';


// SignUp Schema with Zod
export const signupSchema = object({
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


//  Login Schema with Zod
export const loginSchema = object({
    email: string().min(1, 'Email is required').email('Email is invalid'),
    password: string()
      .min(1, 'Password is required')
      .min(3, 'Password must be more than 3 characters')
      .max(32, 'Password must be less than 32 characters'),
});