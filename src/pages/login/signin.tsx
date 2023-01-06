import { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Button from '@mui/material/Button';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import { useNavigate } from 'react-router-dom';
import LocalStorageService from '../../shared/services/localStorage';
import './signup.scss';
import './background.scss';
import SnackBar from '../../shared/components/snack-bar';
import LoginService from '../../shared/services/login';
import jwt_decode from "jwt-decode";
import LocalStorage from '../../shared/services/localStorage';

const isLogged = (): boolean => {
    let accessToken = LocalStorageService.getAccessToken();
    let loggedIn = LocalStorageService.getLoggedTime();
    let expiresIn = LocalStorageService.getExpireTime();

    if (accessToken) {
        if (expiresIn > loggedIn) {
            return true;
        }
    }

    return false;
}

const Signin = () => {
    const [snackBar, setSnackBar] = useState({});
    const navigate = useNavigate();
    const userField: any = useRef("");
    const passcodeField: any = useRef("");

    useEffect(() => {
        if (isLogged())
            document.location.reload();
    }, []);

    const logar = (user: string, passcode: string) => {
        //PassCode
        //4u^w3&8KJ4j4NYBp

        let login = {
            username: btoa(user),
            passcode: btoa(passcode)
        }

        LoginService.getLogin(login).then((response) => {
            let decoded: Object = jwt_decode(response.data.login);

            LocalStorage.setLoggedTime(new Date().getTime());
            let nextWeek = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
            LocalStorage.setExpireTime(nextWeek);
            LocalStorage.setAccessToken(response.data.login);
            LocalStorage.setTokenInfo(decoded);
            document.location.reload();

        }).catch((err) => {
            console.log(err);
            setSnackBar({
                isOpened: true,
                message: "Usuário e senha não encontrados, tente novamente",
                button: "OK"
            });
        });
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='left-card'>
                    <h1>Novo Aqui?</h1>
                    <p>Se registre em nosso website para desfrutar das funcionalidades</p>
                    <ButtonUnstyled onClick={() => navigate("/signup")}
                        className="left-button">CADASTRAR</ButtonUnstyled>
                </div>
                <div className='right-card'>
                    <div className="right-header">
                        <MonetizationOnIcon color="success" fontSize="large" />
                        <p>Code Interview APP</p>
                    </div>
                    <div className="right-login">
                        <h2>Logar na sua conta</h2>
                        <small>usando o seu sistema favorito</small>
                        <div className="btn-card">
                            <IconButton aria-label="google">
                                <GoogleIcon sx={{ color: 'red' }} />
                            </IconButton>
                            <IconButton aria-label="facebook">
                                <FacebookIcon color="primary" />
                            </IconButton>
                            <IconButton aria-label="dlinkedin">
                                <LinkedInIcon color="primary" />
                            </IconButton>
                        </div>
                        <div className='divider-card'>
                            <Divider><small>OU</small></Divider>
                        </div>
                        <TextField
                            sx={{ width: '60%', marginBottom: '15px' }}
                            label="Usuário"
                            variant="filled"
                            inputRef={userField} />
                        <TextField
                            sx={{ width: '60%', marginBottom: '15px' }}
                            type="password"
                            label="Senha"
                            variant="filled"
                            inputRef={passcodeField} />
                        <Button onClick={() => { 
                            logar(userField.current.value, passcodeField.current.value);
                        }} sx={{
                            color: 'white',
                            borderRadius: '20px',
                        }} variant="contained">LOGAR</Button>

                    </div>
                    <div className="right-footer">
                        <footer><small>Todos os direitos reservados a Andrius Informática</small></footer>
                    </div>
                </div>
            </div>
            <SnackBar 
                snackProperties={snackBar}
                setSnackBar={setSnackBar}
            />
        </div>
    );
};

export default Signin;