import axios from 'axios';
import { environment } from "../../environments/environment";
import { headers } from "./login";

const TopicsService = {

    getTopics() {
        let url = environment.api_host + "/topics";
        return axios.get(url, headers);
    },

    addTopic(data: Object) {
        let url = environment.api_host + "/topics";
        return axios.post(url, data, headers);
    },

    updateTopic(id: string, data: Object) {
        let url = environment.api_host + `/topics/${id}`;
        return axios.patch(url, data, headers);
    },

    deleteTopic(id: string) {
        let url = environment.api_host + `/topics/${id}`;
        return axios.delete(url, headers);
    }
}

export default TopicsService;