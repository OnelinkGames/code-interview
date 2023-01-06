import { Outlet } from "react-router-dom";
import Signin from '../../pages/login/signin';
import LocalStorageService from '../services/localStorage';

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

const ProtectedRoutes = () => {
    return isLogged() ? <Outlet /> : <Signin />;
};

export default ProtectedRoutes;