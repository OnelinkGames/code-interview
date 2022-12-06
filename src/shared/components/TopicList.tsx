import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import TopicsModel from "../models/topics";
import TopicsService from "../services/topics";
import SnackContext from "./SnackContext";
import './topics.scss'

function TopicList(props: any) {
    const { onChangeFunction, startTopicValue = "" } = props;

    const { snackBar } = useContext(SnackContext);

    const [topicValue, setTopicValue] = useState("");
    const [topicList, setTopicList] = useState(Array<TopicsModel>);

    useEffect(() => {
        setTopicValue(startTopicValue);
    }, [startTopicValue]);

    useEffect(() => {
        TopicsService.getTopics().then((response) => {
            setTopicList(response.data);
        }).catch((err) => {
            console.log(err);
            snackBar({
                isOpened: true,
                message: "Erro ao carregar tópicos.",
                button: "OK"
            });
        });
    }, []);

    return (
        <div className="topic-list">
            <p>Insira o tópico</p>
            <Autocomplete
                selectOnFocus
                handleHomeEndKeys
                freeSolo
                value={topicValue}
                id="topicoComplete"
                options={topicList}
                onChange={onChangeFunction}
                sx={{
                    width: 300,
                    marginBottom: '40px'
                }}
                renderInput={(params) =>
                    <TextField {...params} size="small" label="tópico" variant="filled" />} />
        </div>
    )
}

export default TopicList;