import axios from 'axios';
import { environment } from "../../environments/environment";

const TopicsService = {

    getTopics() {
        let url = environment.api_host + "/topics"
        return axios.get(url);
    }

}

export default TopicsService;