import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface SnackBarProps {
    snackProperties: any;
    setSnackBar: React.Dispatch<React.SetStateAction<any>>;
}

export default function SnackBar(props: SnackBarProps) {
    const { snackProperties, setSnackBar } = props;

    const handleClick = () => {
        setSnackBar({
            isOpened: true,
            message: snackProperties.message,
            button: snackProperties.button
        });
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBar({
            isOpened: false,
            message: snackProperties.message,
            button: snackProperties.button
        });
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                {snackProperties.button}
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Snackbar
            open={snackProperties.isOpened}
            autoHideDuration={4000}
            onClose={handleClose}
            message={snackProperties.message}
            action={action}
        />
    );
}