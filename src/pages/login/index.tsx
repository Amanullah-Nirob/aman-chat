
import { Box } from "@mui/material";
import Image from "next/image";
import loginLeft from "../../../public/static/images/login_left.png";
import logo from "../../../public/static/images/logo.png";
import SingIn from "../../components/authentication/SingIn";
import SwitchToggle from "../../components/authentication/SwitchToggle";


const Login = () => {
	return (
		<Box 
		className="login-area-main"
		sx={{backgroundColor: '#eeeeee'}}
		>
			<SwitchToggle></SwitchToggle> 
			<div className="login-box-area">
				<div className="login-left">
					<Image src={loginLeft} priority layout='fill' alt="login" />
				</div>
				<div className="login-form">
					<div className="login-logo">
						<div className="logo-image"><Image layout="fill" src={logo} alt="logo" /></div>
						<h2>Hooks-Admin</h2>
					</div>
					<div className="login-inputs-area">
					<SingIn></SingIn>
					</div>
				</div>
			</div>
		</Box>
	);
};

export default Login;
