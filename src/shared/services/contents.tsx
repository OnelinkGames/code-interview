import axios from 'axios';
import { environment } from "../../environments/environment";
import ContentsModel from "../models/content";

const ContentsService = {

    getContents(topicId: string, subTopicId: string) {
        let url = environment.api_host + `/contents?topic=${topicId}&subtopic=${subTopicId}`
        return axios.get(url);
    },

    getContent(id: string) {
        let url = environment.api_host + `/contents/${id}`
        return axios.get(url);
    },

    deleteContent(id: string) {
        let url = environment.api_host + `/contents/${id}`
        return axios.delete(url);
    },

    createContent(content: ContentsModel) {
        let url = environment.api_host + `/contents`
        return axios.post(url, content);
    },

    updateContent(id: string, content: ContentsModel) {
        let url = environment.api_host + `/contents/${id}`
        return axios.patch(url, content);
    }
}

export default ContentsService;