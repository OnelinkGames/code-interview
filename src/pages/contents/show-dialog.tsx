import { useState, useEffect } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import BrazilFlag from '../../assets/brazil-flag.png';
import UsaFlag from '../../assets/usa-flag.png';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import './show-dialog.scss'
import '../../shared/styles/markdown.scss';

export interface ShowDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  title: string;
  content: any;
}

function ShowDialog(props: ShowDialogProps) {
  const { onClose, open, title, content } = props;

  const handleClose = () => {
    onClose("");
  };

  const [markDownContent, setMarkDownContent] = useState('');

  useEffect(() => {
    if (open) {
      setMarkDownContent(content.contentBR);
    }
  }, [content]);

  function changeToBr() {
    setMarkDownContent(content.contentBR);
  }

  function changeToUsa() {
    setMarkDownContent(content.contentUSA);
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
        <div className="markdown_style">
          <ReactMarkdown children={
            markDownContent ? markDownContent : content.contentBR
          } remarkPlugins={[remarkGfm]} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShowDialog;