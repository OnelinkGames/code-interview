import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import SubTopicsService from '../../shared/services/subtopics';

export interface DeleteDialogProps {
    onClose: (value: string) => void;
    dialogConfig: any;
}

function DeleteDialog(props: DeleteDialogProps) {
    const { onClose, dialogConfig } = props;

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
                Você tem certeza que deseja remover este sub-tópico?
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={() => onDelete()}>Deletar</Button>
                <Button variant="contained" onClick={() => handleClose("")}>Fechar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog;