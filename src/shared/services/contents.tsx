import axios from 'axios';
import { environment } from "../../environments/environment";
import ContentsModel from "../models/content";
import { headers } from "./login";

const ContentsService = {

    getContents(topicId: string, subTopicId: string) {
        let url = environment.api_host + `/contents?topic=${topicId}&subtopic=${subTopicId}`
        return axios.get(url, headers);
    },

    getContent(id: string) {
        let url = environment.api_host + `/contents/${id}`
        return axios.get(url, headers);
    },

    deleteContent(id: string) {
        let url = environment.api_host + `/contents/${id}`
        console.log(url);
        return axios.delete(url, headers);
    },

    createContent(content: ContentsModel) {
        let url = environment.api_host + `/contents`
        return axios.post(url, content, headers);
    },

    updateContent(id: string, content: ContentsModel) {
        let url = environment.api_host + `/contents/${id}`
        return axios.patch(url, content, headers);
    }
}

export default ContentsService;