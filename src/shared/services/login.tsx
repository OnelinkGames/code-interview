import axios from 'axios';
import { environment } from "../../environments/environment";
import LocalStorage from './localStorage';

const getHeaders = (): Object => {
    let token = LocalStorage.getAccessToken();

    if (token != "" || !token) {
        return {
            "Authorization": "Bearer "+ token,
            "Content-Type": "application/json"
        }
    } else {
        //Ir para a pagina de login
    }

    return {};
}

type header = {
    headers: any;
}

export const headers: header = {
    headers: getHeaders()
}

const LoginService = {

    getLogin(login: Object) {
        const url = environment.api_host + `/login`;
        return axios.get(url, {
            params: login
        });
    },
}

export default LoginService;