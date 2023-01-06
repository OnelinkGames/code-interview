import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import './topic-list.scss'

function SubTopicList(props: any) {
    const { onChangeFunction, startSubTopicValue = "", subTopicList, subTopicDisabled } = props;


    const [subTopicValue, setSubTopicValue] = useState("");

    useEffect(() => {
        setSubTopicValue(startSubTopicValue);
    }, [startSubTopicValue]);

    return (
        <div className="subtopic-list">
            <p>Insira o sub-tópico</p>
            <Autocomplete
                disabled={subTopicDisabled}
                selectOnFocus
                handleHomeEndKeys
                freeSolo
                value={subTopicValue}
                id="subTopicoComplete"
                options={subTopicList}
                sx={{ width: 300 }}
                onChange={onChangeFunction}
                renderInput={(params) => <TextField {...params} size="small" label="sub-tópico" variant="filled" />} />
        </div>
    )
}
 
export default SubTopicList;