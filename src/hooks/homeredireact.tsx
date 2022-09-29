import { NextComponentType } from "next";
import Login from "../pages/login";
import {useAppSelector} from '../app/hooks'
import {selectCurrentUser} from '../app/slices/auth/authSlice'
import Home from "../pages";
import { useRouter } from "next/router";

function homeredireact(Component: NextComponentType) {
  const Auth = (props: JSX.IntrinsicAttributes) => {
    const user=useAppSelector(selectCurrentUser)
    const router =useRouter()
   
    // If user is not logged in, return login component
    if (!user.token) {
      return  <Component {...props} />
    }

    // If user is logged in, return original component
    return (
      <Home></Home>
    )
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default homeredireact;