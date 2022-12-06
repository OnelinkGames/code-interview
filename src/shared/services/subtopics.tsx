import axios from 'axios';
import { environment } from "../../environments/environment";

const SubTopicsService = {

    getSubTopics(id: string = "") {
        let url = environment.api_host;
        if (id != "")
            url = url + `/subtopics?topic=${id}`;
        else
            url = url + `/subtopics`;

        return axios.get(url);
    },

    deleteSubTopic(id: string) {
        let url = environment.api_host + `/subtopics/${id}`
        return axios.delete(url);
    },

    updateSubTopic(id: string, subtopic: Object) {
        let url = environment.api_host + `/subtopics/${id}`
        return axios.patch(url, subtopic);
    },

    createSubTopic(subtopic: Object) {
        let url = environment.api_host + `/subtopics`
        return axios.post(url, subtopic);
    },

}

export default SubTopicsService;