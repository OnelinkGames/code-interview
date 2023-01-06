import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect, MouseEvent, SyntheticEvent, useReducer } from 'react'
import SnackBar from '../../shared/components/snack-bar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import SubTopicsService from '../../shared/services/subtopics';
import SubTopicDeleteDialog from './delete-dialog';
import CDialog from './dialog'
import SnackContext from '../../shared/components/snack-context';
import TopicList from '../../shared/components/topic-list';
import './subtopic.scss';

function CreateSubTopic(props: any) {
    const { openCreate } = props;

    return (
        <div className="create-button">
            <Button onClick={openCreate}
                variant="contained">Cadastrar um sub-tópico</Button>
        </div>
    )
}

function configPagination(state: any, action: any) {
    switch (action.type) {
        case "page":
            return { ...state, currentPage: action.content };
        case "total":
            return { ...state, totalRows: action.content };
        case "rowsPerPage":
            return { ...state, rowsPerPage: action.content };
    }
}

function DinamycMenu(props: any) {
    const { data, openChange, openDelete } = props;

    const [actionsEl, setActionsEl] = useState<null | HTMLElement>(null);

    const openActions = (event: MouseEvent<HTMLButtonElement>) => {
        setActionsEl(event.currentTarget);
    };

    const closeActions = () => {
        setActionsEl(null);
    };

    const localOpenChange = (title: string, object: Object) => {
        openChange(title, object);
        closeActions();
    };

    const localOpenDelete = (title: string, id: string) => {
        openDelete(title, id);
        closeActions();
    };

    return (
        <>
            <IconButton size="small" onClick={openActions}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id={data.id}
                anchorEl={actionsEl}
                open={Boolean(actionsEl)}
                onClose={closeActions}
            >
                <MenuItem onClick={() =>
                    localOpenChange(
                        "Alterar o sub-tópico",
                        data
                    )}>
                    <EditIcon sx={{
                        marginRight: '10px',
                        color: "blue"
                    }} />Editar</MenuItem>
                <MenuItem onClick={() =>
                    localOpenDelete(
                        data.topic.description + ' - ' + data.label,
                        data.id
                    )}>
                    <DeleteIcon sx={{
                        marginRight: '10px',
                        color: 'red'
                    }} />Excluir</MenuItem>
            </Menu>
        </>
    );
}

function SubTopicTable(props: any) {
    const { tableData, operationsFunction, deleteFunction } = props;

    const openChange = (title: string, object: Object) => {
        operationsFunction(title, object);
    };

    const openDelete = (title: string, id: string) => {
        deleteFunction(title, id);
    };

    // Table Pagination Data
    const [pagination, paginationConfig] = useReducer(configPagination, {
        currentPage: 0,
        totalRows: 0,
        rowsPerPage: 10
    });

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        paginationConfig({ type: "page", content: newPage });
    };

    useEffect(() => {
        if (tableData.length > 0) {
            paginationConfig({ type: "page", content: 0 });
            paginationConfig({ type: "total", content: tableData.length });
        }
    }, [tableData]);

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        paginationConfig({ type: "page", content: 0 });
        paginationConfig({ type: "rowsPerPage", content: parseInt(event.target.value, 10) });
    };

    return (
        <>
            <div className="content-table">
                <TableContainer component={Paper} sx={{
                    maxWidth: '80%',
                }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Tópico</TableCell>
                                <TableCell>Sub-tópico</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row: any, index: number) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.topic.description}</TableCell>
                                    <TableCell>{row.label}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <DinamycMenu 
                                            data={row}
                                            openChange={openChange}
                                            openDelete={openDelete}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="content-table">
                <TableContainer component={Paper} sx={{
                    maxWidth: '80%'
                }}>
                    <TablePagination
                        component={"div"}
                        count={pagination.totalRows}
                        page={pagination.currentPage}
                        onPageChange={handleChangePage}
                        rowsPerPage={pagination.rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        showFirstButton
                        showLastButton
                        sx={{
                            marginTop: '10px',
                            marginRight: '10px',
                        }}
                    />
                </TableContainer>
            </div>
        </>
    )
}

function configDelete(state: any, action: any) {
    switch (action.type) {
        case "status":
            return { ...state, isOpened: action.content };
        case "title":
            return { ...state, title: action.content };
        case "id":
            return { ...state, id: action.content };
        case "allBlank":
            return { isOpened: false, title: "", id: "" };
    }
}

function configDialog(state: any, action: any) {
    switch (action.type) {
        case "status":
            return { ...state, isOpened: action.content };
        case "title":
            return { ...state, title: action.content };
        case "data":
            return { ...state, data: action.content };
        case "allBlank":
            return { isOpened: false, title: "", data: {} };
    }
}

function SubTopicLayout() {
    // Page Logic and Data
    const [filteredTable, setFilteredTable] = useState([]);
    const [snackBar, setSnackBar] = useState({});

    const updateTable = (event: SyntheticEvent, object: any) => {
        if (object) {
            SubTopicsService.getSubTopics(String(object.id)).then((response) => {
                setFilteredTable(response.data);
            }).catch((err) => {
                console.log(err);
                setSnackBar({
                    isOpened: true,
                    message: "Erro ao trazer lista de sub-tópicos",
                    button: "OK"
                });
            });
        } else {
            setFilteredTable([]);
        }
    }

    // Dialog Delete Logic anda Data
    const [deleteDialog, deleteDialogConfig] = useReducer(configDelete, {
        isOpened: false,
        title: "",
        id: ""
    });

    const closeDialogDelete = (value: string) => {
        if (value) {
            let dialogValue = JSON.parse(value);
            if (dialogValue.status == "success") {
                setSnackBar({
                    isOpened: true,
                    message: dialogValue.message,
                    button: "OK"
                });
                deleteDialogConfig({ type: "allBlank" });
            } else if (dialogValue.status == "fail") {
                deleteDialogConfig({ type: "status", content: true });
                setSnackBar({
                    isOpened: true,
                    message: "Ocorreu algum problema, tente novamente.",
                    button: "OK"
                });
            } else {
                deleteDialogConfig({ type: "status", content: false });
            }

        } else {
            deleteDialogConfig({ type: "status", content: false });
        }
    }

    const openDelete = (title: string, id: string) => {
        deleteDialogConfig({ type: "status", content: true });
        deleteDialogConfig({ type: "title", content: title });
        deleteDialogConfig({ type: "id", content: id });
    }

    // Dialog Edit/Create Logic and Data.
    const [dialog, dialogConfig] = useReducer(configDialog, {
        isOpened: false,
        title: "",
        data: {}
    });

    const closeDialog = (value: string) => {
        if (value) {
            let dialogValue = JSON.parse(value);
            console.log(dialogValue);
            if (dialogValue.status == "success") {
                setSnackBar({
                    isOpened: true,
                    message: dialogValue.message,
                    button: "OK"
                });
                dialogConfig({ type: "allBlank" });
            } else {
                dialogConfig({ type: "status", content: false });
                dialogConfig({ type: "data", content: {} });
            }
        } else {
            dialogConfig({ type: "status", content: false });
            dialogConfig({ type: "data", content: {} });
        }
    }

    const openCreate = (title: string, object: Object = {}) => {
        dialogConfig({ type: "status", content: true });
        dialogConfig({ type: "title", content: "Criar um sub-tópico" });
        dialogConfig({ type: "data", content: object });
    };

    const openEdit = (title: string, object: Object = {}) => {
        dialogConfig({ type: "status", content: true });
        dialogConfig({ type: "title", content: "Editar um sub-tópico" });
        dialogConfig({ type: "data", content: object });
    };

    return (
        <>
            <SnackContext.Provider value={{ snackBar: setSnackBar }}>
                <CreateSubTopic
                    openCreate={openCreate}
                />
                <div className="topic">
                    <TopicList
                        onChangeFunction={updateTable}
                    />
                </div>
                <SubTopicTable
                    tableData={filteredTable}
                    operationsFunction={openEdit}
                    deleteFunction={openDelete}
                />
                <SubTopicDeleteDialog
                    onClose={closeDialogDelete}
                    dialogConfig={deleteDialog}
                />
                <CDialog
                    onClose={closeDialog}
                    dialogConfig={dialog}
                />
                <SnackBar
                    snackProperties={snackBar}
                    setSnackBar={setSnackBar}
                />
            </SnackContext.Provider>
        </>
    )
}

export default SubTopicLayout;
