import { useState, useEffect, useContext, useReducer } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SnackContext from "../../shared/components/snack-context"
import TopicsService from '../../shared/services/topics';
import "./topic.scss";

export interface DialogProps {
    onClose: (value: Object) => void;
    dialogConfig: any;
}

function configSubmit(state: any, action: any) {
    switch (action.type) {
        case "id":
            return { ...state, id: action.content };
        case "label":
            return { ...state, label: action.content };
        case "status":
            return { ...state, isDisabled: action.content };
        case "allBlank":
            return { id: "", label: "", topic: { id: "", description: "" }, isDisabled: true };
    }
}

function CDialog(props: DialogProps) {
    const { onClose, dialogConfig } = props;

    const [submit, submitConfig] = useReducer(configSubmit, {
        id: "",
        label: "",
        isDisabled: true
    });

    const [topicValue, setTopicValue] = useState("");

    useEffect(() => {
        if (dialogConfig.isOpened) {
            if (Object.hasOwn(dialogConfig.data, "id")) {
                let data = dialogConfig.data;
                submitConfig({ type: "id", content: String(data.id) });
                submitConfig({ type: "label", content: data.label });
                setTopicValue(data.label);
            } else {
                submitConfig({ type: "allBlank" });
                setTopicValue("");
            }

            checkDisabled(submit.label);
        }
    }, [dialogConfig]);

    const handleClose = (message: Object) => {
        onClose(message);
    };

    const fillTopic = (event: any) => {
        setTopicValue(event.target.value);

        checkDisabled(event.target.value);
    }

    const checkDisabled = (topic: string) => {
        if (Object.hasOwn(dialogConfig.data, "id")) {
            let condition = (topic != dialogConfig.data.label);
            if (topic != "" && condition) {
                submitConfig({ type: "status", content: false });
            } else {
                submitConfig({ type: "status", content: true });
            }
        } else {
            if (topic != "") {
                submitConfig({ type: "status", content: false });
            } else {
                submitConfig({ type: "status", content: true });
            }
        }
    }

    const submitForm = () => {
        if (Object.hasOwn(dialogConfig.data, "id")) {
            submit.label = topicValue;
            TopicsService.updateTopic(dialogConfig.data.id, submit).then((response) => {
                handleClose({
                    status: "success",
                    message: response.data.message
                });
            }).catch((err) => {
                console.log(err);
            });
        } else {
            submit.label = topicValue;
            TopicsService.addTopic(submit).then((response) => {
                handleClose({
                    status: "success",
                    message: response.data.message
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    return (
        <Dialog
            onClose={handleClose}
            open={dialogConfig.isOpened}
            maxWidth="xl">
            <DialogTitle sx={{ textAlign: 'center' }}>{dialogConfig.title}
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly'
                }}>
                <div className="topic">
                    <p>Insira o tópico</p>
                    <TextField sx={{
                        width: 300,
                        marginBottom: '40px'
                    }}
                        id="topic"
                        label="tópico"
                        variant="filled"
                        size="small"
                        onChange={fillTopic}
                        value={topicValue}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={submit.isDisabled} onClick={submitForm}>
                    {dialogConfig.title.includes("Criar") ? "Criar" : "Editar"}
                </Button>
                <Button variant="contained" color="error" onClick={() => handleClose({})}>Fechar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CDialog;