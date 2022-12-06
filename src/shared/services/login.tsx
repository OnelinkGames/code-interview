import axios from 'axios';
import { environment } from "../../environments/environment";

const LoginService = {

    getLogin(login: Object) {
        const url = environment.api_host + `/login`;
        return axios.get(url, {
            params: login
        });
    }
}

export default LoginService;