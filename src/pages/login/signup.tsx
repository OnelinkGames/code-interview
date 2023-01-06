import React from 'react';
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
import './signup.scss';
import './background.scss';

const Signup = () => {
    const navigate = useNavigate();

    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='left-card'>
                    <h1>Bem vindo de Volta</h1>
                    <p>Para permanecer conectado com a gente, se logue com suas informações pessoais</p>
                    <ButtonUnstyled onClick={() => navigate("/")}
                        className="left-button">LOGAR</ButtonUnstyled>
                </div>
                <div className='right-card'>
                    <div className="right-header">
                        <MonetizationOnIcon color="success" fontSize="large" />
                        <p>Code Interview APP</p>
                    </div>
                    <div className="right-login">
                        <h2>Criar Conta</h2>
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
                            variant="filled" />
                        <TextField
                            sx={{ width: '60%', marginBottom: '15px' }}
                            type="password"
                            label='Senha'
                            variant="filled" />
                        <Button sx={{
                            color: 'white',
                            borderRadius: '20px',
                        }} variant="contained">Cadastrar</Button>

                    </div>
                    <div className="right-footer">
                        <footer><small>Todos os direitos reservados a Andrius Informática</small></footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;