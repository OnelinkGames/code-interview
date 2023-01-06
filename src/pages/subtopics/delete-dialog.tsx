import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import SubTopicsService from '../../shared/services/subtopics';
import { useEffect, useState } from 'react';
import ContentsService from '../../shared/services/contents';
import Alert from '@mui/material/Alert';

export interface DeleteDialogProps {
    onClose: (value: string) => void;
    dialogConfig: any;
}

function DeleteDialog(props: DeleteDialogProps) {
    const { onClose, dialogConfig } = props;

    const [qtdContent, setQtdContent] = useState(0);

    useEffect(() => {
        if (dialogConfig.isOpened) {
            try {
                SubTopicsService.getSubTopic(String(dialogConfig.id)).then((response) => {
                    ContentsService.getContents(String(response.data.topic.id), String(response.data.id)).then((responseContent) => {
                        setQtdContent(responseContent.data.length);
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log(err);
                });
            } catch (err) {
                setQtdContent(0);
            }
        }
    }, [dialogConfig]);

    const handleClose = (message: string) => {
        onClose(message);
    };

    const onDelete = () => {
        SubTopicsService.deleteSubTopic(dialogConfig.id).then((response) => {
            handleClose(JSON.stringify({
                status: "success",
                message: response.data.message
            }));
        }).catch((err) => {
            console.log(err);
            handleClose(JSON.stringify({
                status: "fail",
                message: ""
            }));
        });
    };

    return (
        <Dialog onClose={() => handleClose("")} open={dialogConfig.isOpened} fullWidth>
            <DialogTitle sx={{ textAlign: 'center' }}>{dialogConfig.title}
            </DialogTitle>
            <DialogContent>
                <>
                    Você tem certeza que deseja remover este sub-tópico?
                    {qtdContent ?
                        qtdContent == 1 ? <Alert severity="warning" sx={{ marginTop: '10px' }}>
                            Aviso você irá remover {qtdContent} conteúdo deste sub-tópico
                        </Alert> : 
                        <Alert severity="warning" sx={{ marginTop: '10px' }}>
                            Aviso você irá remover {qtdContent} conteúdos deste sub-tópico
                        </Alert> 
                    : null}
                </>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={() => onDelete()}>Deletar</Button>
                <Button variant="contained" onClick={() => handleClose("")}>Fechar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog;