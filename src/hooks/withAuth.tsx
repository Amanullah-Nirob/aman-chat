import { NextComponentType } from "next";
import Login from "../pages/login";
import {useAppSelector} from '../app/hooks'
import {selectCurrentUser} from '../app/slices/auth/authSlice'
import jwtDecode from "jwt-decode";


function withAuth(Component: NextComponentType) {
  const Auth = (props: JSX.IntrinsicAttributes) => {
    const user:any=useAppSelector(selectCurrentUser)
 
    // If user is not logged in, return login component
    if (!user?.token) {
      return <Login />;
    }
    
   if (user.token) {
    const data:any = jwtDecode(user.token);
    if(user._id !== data.id){
      return <Login />;
    }
   }

   if (Date.now() >= parseInt(user.expiryTime)) {
    return <Login />;
   }
  

    // If user is logged in, return original component
    return (
        <Component {...props} />
    )
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuth;