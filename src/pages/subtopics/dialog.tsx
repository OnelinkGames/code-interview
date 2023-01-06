import { SyntheticEvent, useState, useEffect, useContext, useReducer } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SnackContext from "../../shared/components/snack-context"
import SubTopicsService from '../../shared/services/subtopics';
import TopicList from '../../shared/components/topic-list';

export interface DialogProps {
  onClose: (value: string) => void;
  dialogConfig: any;
}

function configSubmit(state: any, action: any) {
  switch (action.type) {
    case "id":
      return { ...state, id: action.content };
    case "label":
      return { ...state, label: action.content };
    case "topic":
      return { ...state, topic: { id: action.content, description: action.content2 } };
    case "status":
      return { ...state, isDisabled: action.content };
    case "allBlank":
      return { id: "", label: "", topic: { id: "", description: "" }, isDisabled: true };
  }
}

function CDialog(props: DialogProps) {
  const { onClose, dialogConfig } = props;

  const { snackBar } = useContext(SnackContext);

  const [submit, submitConfig] = useReducer(configSubmit, {
    id: "",
    label: "",
    topic: {
      id: "",
      description: ""
    },
    isDisabled: true
  });

  const [submitDisabled2, setSubmitDisabled2] = useState(true);
  const [subTopicValue, setSubtopicValue] = useState("");

  useEffect(() => {
    if (dialogConfig.isOpened) {
      if (Object.hasOwn(dialogConfig.data, "id")) {
        let data = dialogConfig.data;
        submitConfig({ type: "id", content: String(data.id) });
        submitConfig({ type: "label", content: data.label });
        submitConfig({ type: "topic", content: String(data.topic.id), content2: data.topic.description });
        setSubtopicValue(data.label);
      } else {
        submitConfig({ type: "allBlank" });
        setSubtopicValue("");
      }

      checkDisabled(submit.topic.description, submit.label);
    }
  }, [dialogConfig]);

  const handleClose = () => {
    onClose("");
  };

  const getTopic = (event: SyntheticEvent, object: any) => {
    let data = dialogConfig.data;
    if (object) {
      submitConfig({ type: "id", content: String(data.id) });
      submitConfig({ type: "label", content: data.label });
      submitConfig({ type: "topic", content: String(object.id), content2: object.label });
      checkDisabled(object.label, subTopicValue);
    } else {
      submitConfig({ type: "id", content: String(data.id) });
      submitConfig({ type: "label", content: data.label });
      submitConfig({ type: "topic", content: "", content2: "" });
      checkDisabled("", subTopicValue);
    }
  }

  const fillSubTopic = (event: any) => {
    setSubtopicValue(event.target.value);

    checkDisabled(submit.topic.description, event.target.value);
  }

  const checkDisabled = (topic: string, subtopic: string) => {
    if (Object.hasOwn(dialogConfig.data, "id")) {
      let condition = (topic != dialogConfig.data.topic.description || subtopic != dialogConfig.data.label);
      if (topic != "" && subtopic != "" && condition) {
        submitConfig({ type: "status", content: false });
      } else {
        submitConfig({ type: "status", content: true });
      }
    } else {
      if (topic != "" && subtopic != "") {
        submitConfig({ type: "status", content: false });
      } else {
        submitConfig({ type: "status", content: true });
      }
    }
  }

  const submitForm = () => {
    if (Object.hasOwn(dialogConfig.data, "id")) {
      submit.label = subTopicValue;
      SubTopicsService.updateSubTopic(dialogConfig.data.id, submit).then((response) => {
        snackBar({
          isOpened: true,
          message: "Sub-Tópico atualizado com sucesso.",
          button: "OK"
        });
        handleClose();
      }).catch((err) => {
        console.log(err);
        snackBar({
          isOpened: true,
          message: "Ocorreu algum erro ao atualizar o sub-tópico",
          button: "OK"
        });
      });
    } else {
      submit.label = subTopicValue;
      submit.id = String(Math.floor(Math.random() * 1000));
      SubTopicsService.createSubTopic(submit).then((response) => {
        snackBar({
          isOpened: true,
          message: "Sub-Tópico inserido com sucesso",
          button: "OK"
        });
        handleClose();
      }).catch((err) => {
        console.log(err);
        snackBar({
          isOpened: true,
          message: "Ocorreu algum erro ao inserir o sub-tópico",
          button: "OK"
        });
      });
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      open={dialogConfig.isOpened}
      maxWidth="xl"
      fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{dialogConfig.title}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly'
        }}>
        <TopicList
          onChangeFunction={getTopic}
          startTopicValue={
            Object.hasOwn(dialogConfig.data, "id") ? dialogConfig.data.topic.description : ""
          }
        />
        <div className="subtopic">
          <p>Insira o sub-tópico</p>
          <TextField sx={{
            width: 300,
            marginBottom: '40px'
          }}
            id="subtopic"
            label="sub-tópico"
            variant="filled"
            size="small"
            onChange={fillSubTopic}
            value={subTopicValue}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disabled={submit.isDisabled} onClick={submitForm}>
          {dialogConfig.title.includes("Criar") ? "Criar" : "Editar"}
        </Button>
        <Button variant="contained" color="error" onClick={handleClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CDialog;