
import { Box,styled ,Grid} from "@mui/material";
import Image from "next/image";
import loginLeft from "../../../public/static/images/login_left.png";
import logo from "../../../public/static/images/logo.png";
import { selectTheme } from "../../app/slices/theme/ThemeSlice";
import SingIn from "../../components/authentication/SingIn";
import SwitchToggle from "../../components/authentication/SwitchToggle";
import PageContainer from "../../components/layouts/PageContainer";
import { useAppSelector } from "../../app/hooks";

const Login = () => {
	const MaterialUIBox = styled(Box)(({ theme }) => ({
        backgroundColor:theme.palette.mode=='dark'? '#141414':'#eeeeee',
    }));
	const theme=useAppSelector(selectTheme)

	return (
	<PageContainer title="Login">
		<MaterialUIBox className="login-area-main">
				<SwitchToggle></SwitchToggle> 
				<div className="login-box-area" style={{backgroundColor: theme=='dark'? 'rgba(0, 0, 0, 0.8)' : 'hsla(0, 0%, 100%, 0.8)'}}>
				<Grid container>
				<Grid item xs={12} md={7} sm={12}>
				<div className="login-left">
					<div className="left-content">
					<Image src={loginLeft} priority layout='fill' alt="login" />
					</div>
				</div>
				</Grid>
				<Grid item md={5} sm={12} xs={12} >
				<div className="login-form" style={{backgroundColor: theme=='dark'? '#141414' : 'transparent', boxShadow: theme=='dark'? '5px 5px 15px rgb(255 255 255 / 20%)' : '2px 3px 7px rgb(0 0 0 / 20%)'}}>
						<div className="login-logo">
							<div className="logo-image"><Image layout="fill" src={logo} alt="logo" /></div>
							<h2 style={{color:theme=='dark'?'#d9d9d9':'#475768'}}>Aman Chat</h2>
						</div>
						<div className="login-inputs-area">
						<SingIn></SingIn>
						</div>
					</div>
				</Grid>
			</Grid>
				</div>
		</MaterialUIBox>
	</PageContainer>
	);
};

export default Login;
