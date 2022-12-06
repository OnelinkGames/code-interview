import { SyntheticEvent, useState, useEffect, useContext, useReducer } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Paper from '@mui/material/Paper';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import BrazilFlag from '../../assets/brazil-flag.png';
import UsaFlag from '../../assets/usa-flag.png';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentsService from '../../shared/services/contents';
import ContentsModel from '../../shared/models/content';
import { AutoCompleteFields } from './Layout';
import SnackContext from '../../shared/components/SnackContext';
import './dialog.scss';
import '../../shared/styles/markdown.scss';
import SubTopicsService from '../../shared/services/subtopics';

export interface DialogProps {
  open: boolean;
  onClose: (value: string) => void;
  title: string;
  contentsData: any;
}

function configMarkDown(state: any, action: any) {
  switch (action.type) {
    case "BR":
      return { ...state, contentBR: action.content };
    case "USA":
      return { ...state, contentUSA: action.content };
    case "content":
      return { ...state, content: action.content };
    case "fillBlank":
      return { contentBR: "", contentUSA: "", content: "" };
    case "contentToBR":
      return { ...state, content: state.contentBR };
    case "contentToUSA":
      return { ...state, content: state.contentUSA };
  }
}

function configTopics(state: any, action: any) {
  switch (action.type) {
    case "topic":
      return { ...state, topicContent: action.content };
    case "subtopic":
      return { ...state, subTopicContent: action.content };
    case "topicValue":
      return { ...state, topicValue: action.content };
    case "subtopicValue":
      return { ...state, subTopicValue: action.content };
    case "subtopicStatus":
      return { ...state, subTopicIsDisabled: action.content };
    case "subtopicData":
      return { ...state, subTopicData: action.content };
    case "fillBlank":
      return { topicContent: null, subTopicContent: null, topicValue: "", subTopicValue: "", subTopicIsDisabled: true, subTopicData: [] };
  }
}

function CDialog(props: DialogProps) {
  const { onClose, open, title, contentsData } = props;

  const { snackBar } = useContext(SnackContext);

  useEffect(() => {
    if (contentsData.hasOwnProperty('id')) {
      markDownConfig({ type: "BR", content: contentsData['contentBR'] });
      markDownConfig({ type: "USA", content: contentsData['contentUSA'] });
      markDownConfig({ type: "content", content: contentsData['contentBR'] });
      topicsConfig({ type: "topic", content: contentsData.topic.id });
      topicsConfig({ type: "subtopic", content: contentsData.subtopic.id });
      topicsConfig({ type: "topicValue", content: contentsData.topic.description });
      topicsConfig({ type: "subtopicValue", content: contentsData.subtopic.description });
      topicsConfig({ type: "subtopicStatus", content: false });
    } else {
      markDownConfig({ type: "fillBlank" });
      topicsConfig({ type: "fillBlank" });
    }

    setFlag("BR");
    setSubmitDisabled(true);
  }, [contentsData]);

  const [markDown, markDownConfig] = useReducer(configMarkDown, {
    contentBR: "",
    contentUSA: "",
    content: ""
  });

  const [topics, topicsConfig] = useReducer(configTopics, {
    topicContent: 0,
    subTopicContent: 0,
    topicValue: "",
    subTopicValue: "",
    subTopicIsDisabled: true,
    subTopicData: []
  });

  useEffect(() => {
    isDisabled();
  }, [topics.topicContent, topics.subTopicContent, markDown.content]);

  const [flag, setFlag] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleClose = () => {
    onClose("");
  };

  const fillSubTopicValues = (event: SyntheticEvent, object: any) => {
    if (object) {
      SubTopicsService.getSubTopics(String(object.id)).then((response) => {
        topicsConfig({ type: "subtopicValue", content: "" });
        topicsConfig({ type: "subtopicStatus", content: false });
        topicsConfig({ type: "subtopicData", content: response.data });
      })
        .catch((err) => {
          console.log(err);
          snackBar({
            isOpened: true,
            message: "Erro ao carregar sub-tópicos",
            button: "OK"
          });
        });
    } else {
      topicsConfig({ type: "subtopicValue", content: "" });
      topicsConfig({ type: "subtopicStatus", content: true });
      topicsConfig({ type: "subtopicData", content: [] });
      topicsConfig({ type: "topic", content: null });
      topicsConfig({ type: "subtopic", content: null });
    }
  }

  const logMessage = (event: SyntheticEvent, object: any) => {
    if (object) {
      topicsConfig({ type: "topic", content: object.topic.id });
      topicsConfig({ type: "subtopic", content: object.id });
      topicsConfig({ type: "subtopicValue", content: object.label });
    } else {
      topicsConfig({ type: "topic", content: null });
      topicsConfig({ type: "subtopic", content: null });
    }
  }

  const updateMarkDown = (event: any) => {
    let markDownText = event.target.value;

    if (flag == "BR") {
      markDownConfig({ type: "BR", content: markDownText });
    } else {
      markDownConfig({ type: "USA", content: markDownText });
    }

    markDownConfig({ type: "content", content: markDownText });
  }

  function changeToBr() {
    setFlag("BR");
    markDownConfig({ type: "contentToBR" });
  }

  function changeToUsa() {
    setFlag("USA");
    markDownConfig({ type: "contentToUSA" });
  }

  const submitForm = () => {
    let submit: ContentsModel = {
      id: 0,
      topic: {
        id: topics.topicContent ? topics.topicContent : 0,
        description: ""
      },
      subtopic: {
        id: topics.subTopicContent ? topics.subTopicContent : 0,
        description: ""
      },
      contentBR: markDown.contentBR,
      contentUSA: markDown.contentUSA
    }

    if (contentsData.hasOwnProperty('id')) {
      submit.id = Number.parseInt(contentsData.id);

      ContentsService.updateContent(contentsData.id, submit).then((response) => {
        snackBar({
          isOpened: true,
          message: "Conteúdo atualizado com sucesso.",
          button: "OK"
        });
      })
        .catch((err) => {
          console.log(err);
          snackBar({
            isOpened: true,
            message: "Erro ao atualizar conteúdo",
            button: "OK"
          });
        });
    } else {
      submit.id = Math.floor(Math.random() * 1000);

      ContentsService.createContent(submit).then((response) => {
        snackBar({
          isOpened: true,
          message: "Conteúdo cadastrado com sucesso.",
          button: "OK"
        });
      })
        .catch((err) => {
          console.log(err);
          snackBar({
            isOpened: true,
            message: "Erro ao atualizar conteúdo",
            button: "OK"
          });
        });
    }

    handleClose();
  }

  const isDisabled = () => {
    let firstCheck = topics.topicContent != null && topics.subTopicContent != null;
    let secondCheck = markDown.contentBR && markDown.contentUSA;
    let thirdCheck = (markDown.contentBR != contentsData.contentBR) || (markDown.contentUSA != contentsData.contentUSA);

    if (firstCheck && secondCheck != "" && thirdCheck) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="xl"
      fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{title}
        <div className="flags">
          <Tooltip title="Mudar para Português">
            <IconButton onClick={changeToBr} size="small">
              <img className="flag-shadow" src={BrazilFlag} width="24px" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mudar para Inglês">
            <IconButton onClick={changeToUsa} size="small">
              <img className="flag-shadow" src={UsaFlag} width="24px" />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        <AutoCompleteFields
          onChangeTopic={fillSubTopicValues}
          initialTopicValue={topics.topicValue}
          onChangeSubTopic={logMessage}
          initialSubTopicValue={topics.subTopicValue}
          subTopicList={topics.subTopicData}
          subTopicDisabled={topics.subTopicIsDisabled}
        />
        <div className="mark-down-content">
          <TextField
            sx={{ width: '30%' }}
            id="markdown"
            label="Insira seu MarkDown"
            multiline
            rows={8}
            variant="filled"
            onChange={updateMarkDown}
            value={markDown.content}
            fullWidth
          />
          <SyncAltIcon color={flag == "BR" ? "success" : "error"} />
          <Paper
            sx={{
              width: '30%',
              padding: '5px 10px',
              maxHeight: '220px',
              overflow: 'auto'
            }}
            variant="outlined">
            <div className="markdown_style">
              <ReactMarkdown
                children={markDown.content}
                remarkPlugins={[remarkGfm]} />
            </div>
          </Paper>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={submitForm} variant="contained" disabled={submitDisabled}>
          {title.includes("Criar") ? "Criar" : "Editar"}
        </Button>
        <Button variant="contained" color="error" onClick={handleClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CDialog;