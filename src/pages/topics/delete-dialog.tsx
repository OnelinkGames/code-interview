import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import SubTopicsService from '../../shared/services/subtopics';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import TopicsService from '../../shared/services/topics';

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
                SubTopicsService.getSubTopics(String(dialogConfig.id)).then((response) => {
                    setQtdContent(response.data.length);
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
        TopicsService.deleteTopic(dialogConfig.id).then((response) => {
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
                    Você tem certeza que deseja remover este tópico?
                    {qtdContent ?
                        qtdContent == 1 ? <Alert severity="warning" sx={{ marginTop: '10px' }}>
                            Aviso você irá remover {qtdContent} sub-tópico deste tópico
                        </Alert> :
                            <Alert severity="warning" sx={{ marginTop: '10px' }}>
                                Aviso você irá remover {qtdContent} sub-tópicos deste tópico
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