import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import ContentsService from '../../shared/services/contents'

export interface DeleteDialogProps {
    open: boolean;
    onClose: (value: string) => void;
    title: string;
    id: string;
}

function DeleteDialog(props: DeleteDialogProps) {
    const { onClose, open, title, id } = props;

    const handleClose = (message: string) => {
        onClose(message);
    };

    const deleteContent = () => {
        console.log(id);
        ContentsService.deleteContent(id).then((response) => {
                handleClose(JSON.stringify({
                    status: "success",
                    message: response.data.message
                }));
            });
    };

    return (
        <Dialog onClose={() => handleClose("")} open={open} fullWidth>
            <DialogTitle sx={{ textAlign: 'center' }}>{title}
            </DialogTitle>
            <DialogContent>
                Você tem certeza que deseja remover este conteúdo?
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={deleteContent}>Deletar</Button>
                <Button variant="contained" onClick={() => handleClose("")}>Fechar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog;