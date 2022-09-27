// external imports
import { FC } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from "@mui/material";
//Styled Material UI TextField Component

const CssTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.mode=='dark'?'#bfbfbf':'#000',
    fontWeight: 400,
  },
  '& .MuiInputBase-input': {
    borderColor: '#c8d0d4',
  },
  '& .MuiInput-underline:after': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-error': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d32f2f',
      },
    },
    '& fieldset': {
      borderColor: '#c8d0d4',
      borderRadius: 0,
    },
    '&:hover fieldset': {
      border: '1px solid #c8d0d4',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #c8d0d4',
    },
  },
}));



// 👇 Type of Props the FormInput will receive
type FormInputProps = {
    name: string;
} & TextFieldProps;
  

const AuthFormInputs: FC<FormInputProps> = ({ name, ...otherProps }) => {
    // Utilizing useFormContext to have access to the form Context
    const {
      control,
      formState: { errors },
    } = useFormContext();
  
    return (
      <Controller
        control={control}
        name={name}
  
        render={({ field }) => (
          <CssTextField
            {...field}
            {...otherProps}
            variant='outlined'
            sx={{ mb: '1.5rem' }}
            error={!!errors[name]}
            helperText={
              errors[name] ? (errors[name]?.message as unknown as string) : ''
            }
          />
        )}
      />
    );
  };
  
  export default AuthFormInputs;
