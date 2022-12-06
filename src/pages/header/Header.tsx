import IconButton from "@mui/material/IconButton";
import { useState, MouseEvent, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useNavigate } from "react-router-dom";
import LocalStorage from '../../shared/services/localStorage';
import UsersModel from '../../shared/models/user'
import './header.scss'

function Header() {
    const [personalInfo, setPersonalInfo] = useState<UsersModel>({
        name: "",
        mail: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        let personalInfo: UsersModel = LocalStorage.getTokenInfo();
        setPersonalInfo(personalInfo);
    }, []);

    const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
    const openMenu: boolean = Boolean(anchorElMenu);
    const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElMenu(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const [anchorElUserMenu, setAnchorElUserMenu] = useState<null | HTMLElement>(null);
    const openUserMenu: boolean = Boolean(anchorElUserMenu);
    const handleClickUserMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElUserMenu(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUserMenu(null);
    };

    const menuNavigate = (path: string) => {
        navigate(path);
        setTimeout(() => {
            handleCloseMenu();
        }, 500);
    };

    return (
        <>
            <div className="header">
                <div>
                    <IconButton size="small" onClick={handleClickMenu}>
                        <MenuIcon sx={{ color: 'black' }} />
                    </IconButton>
                    <Menu
                        id="home-menu"
                        anchorEl={anchorElMenu}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => menuNavigate("/")}>Página Inicial</MenuItem>
                        <MenuItem>Tópicos</MenuItem>
                        <MenuItem onClick={() => menuNavigate("/subtopics")}>Sub-tópicos</MenuItem>
                        <MenuItem onClick={() => menuNavigate("/contents")}>Conteúdos</MenuItem>
                    </Menu>
                </div>
                <div className="header-title">
                    Code Interview App
                </div>
                <div className="header-account">
                    <IconButton size="small" onClick={handleClickUserMenu}>
                        <AccountCircleIcon sx={{ color: 'black' }} />
                    </IconButton>
                    <Menu
                        id="user-menu"
                        anchorEl={anchorElUserMenu}
                        open={openUserMenu}
                        onClose={handleCloseUserMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem>
                            <div className="header-account-menu">
                                <div><AccountCircleIcon sx={{
                                    verticalAlign: 'sub'
                                }} /> {personalInfo.name}</div>
                                <div className="header-account-mail">{personalInfo.mail}</div>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <LogoutIcon /> <div className="header-account-logout">Sair</div>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Header;