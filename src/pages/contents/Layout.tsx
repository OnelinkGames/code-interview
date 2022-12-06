import React, { SyntheticEvent, useContext, useEffect, useState, MouseEvent, useReducer } from 'react'
import Button from '@mui/material/Button';
import ContentShowDialog from './ShowDialog';
import ContentDeleteDialog from './DeleteDialog';
import SnackBar from '../../shared/components/SnackBar';
import ContentsModel from '../../shared/models/content';
import ContentDialog from './Dialog';
import ContentsService from '../../shared/services/contents';
import SubTopicsService from '../../shared/services/subtopics';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import TopicList from '../../shared/components/TopicList';
import SubTopicList from '../../shared/components/SubTopicList';
import SnackContext from '../../shared/components/SnackContext';
import './index.scss'

export interface ContentsProps {
    onChange: (event: SyntheticEvent, object: any) => void;
    contentsList?: ContentsModel[];
    setContentsList?: React.Dispatch<React.SetStateAction<ContentsModel[]>>;
}

function CreateContent(props: any) {
    const { createContent } = props;

    return (
        <div className="create-button">
            <Button onClick={() => createContent("Criar um novo conteúdo")}
                variant="contained">Cadastrar um conteúdo</Button>
        </div>
    )
}

export function AutoCompleteFields(props: any) {
    const {
        onChangeTopic,
        initialTopicValue = "",
        onChangeSubTopic,
        initialSubTopicValue = "",
        subTopicList,
        subTopicDisabled
    } = props;

    return (
        <div className="content">
            <TopicList
                onChangeFunction={onChangeTopic}
                startTopicValue={initialTopicValue}
            />
            <SubTopicList
                onChangeFunction={onChangeSubTopic}
                startSubTopicValue={initialSubTopicValue}
                subTopicList={subTopicList}
                subTopicDisabled={subTopicDisabled}
            />
        </div>
    );
}
export interface TableProps {
    tableData: Array<ContentsModel>;
    showFunction: any;
    deleteFunction: any;
    operationsFunction: any;
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

function ContentTable(props: TableProps) {
    const { tableData, showFunction, deleteFunction, operationsFunction } = props;
    const [filteredTable, setFilteredTable] = useState<Array<ContentsModel>>([]);

    // Table Data
    useEffect(() => {
        setFilteredTable(tableData);
    }, []);

    useEffect(() => {
        paginationConfig({ type: "total", content: tableData.length });
        filterTable();
    }, [tableData]);

    const [actionsMenu, setActionsMenu] = useState<null | HTMLElement>(null);
    const openMenu: boolean = Boolean(actionsMenu);
    const openActionsMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setActionsMenu(event.currentTarget);
    };
    const closeActionsMenu = () => {
        setActionsMenu(null);
    };

    const dialogDelete = (title: string, id: string) => {
        deleteFunction(title, id);
        closeActionsMenu();
    }

    const dialogEdit = (title: string, content: ContentsModel) => {
        operationsFunction("Alterar o conteúdo", content);
        closeActionsMenu();
    }

    const filterTable = () => {
        let finalRow = (pagination.currentPage + 1) * pagination.rowsPerPage;
        let initialRow = (finalRow - pagination.rowsPerPage);

        let filtered = tableData.filter((row, index) => {
            return index >= initialRow || index <= finalRow;
        });

        setFilteredTable(filtered);
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
        filterTable();
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        paginationConfig({ type: "page", content: 0 });
        paginationConfig({ type: "rowsPerPage", content: parseInt(event.target.value, 10) });
        filterTable();
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
                                <TableCell sx={{ textAlign: 'center' }}>Visualizar</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTable.map((row: any) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.topic.description}</TableCell>
                                    <TableCell>{row.subtopic.description}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton size="small"
                                            onClick={() => showFunction(row.topic.description + ' - ' + row.subtopic.description,
                                                {
                                                    contentBR: row.contentBR,
                                                    contentUSA: row.contentUSA
                                                })}>
                                            <LaunchIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton size="small" onClick={openActionsMenu}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id="action-menu"
                                            anchorEl={actionsMenu}
                                            open={openMenu}
                                            onClose={closeActionsMenu}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem
                                                onClick={() =>
                                                    dialogEdit(
                                                        row.topic.description + ' - ' + row.subtopic.description,
                                                        row
                                                    )}>
                                                <EditIcon sx={{
                                                    marginRight: '10px',
                                                    color: "blue"
                                                }} />Editar</MenuItem>
                                            <MenuItem
                                                onClick={() =>
                                                    dialogDelete(
                                                        row.topic.description + ' - ' + row.subtopic.description,
                                                        row.id
                                                    )}>
                                                <DeleteIcon sx={{
                                                    marginRight: '10px',
                                                    color: 'red'
                                                }} />Excluir</MenuItem>
                                        </Menu>
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

function configOperations(state: any, action: any) {
    switch (action.type) {
        case "title":
            return { ...state, title: action.content };
        case "status":
            return { ...state, isOpened: action.content };
        case "data":
            return { ...state, data: action.content };
    }
}

function configSubTopic(state: any, action: any) {
    switch (action.type) {
        case "value":
            return { ...state, value: action.content };
        case "status":
            return { ...state, isDisabled: action.content };
        case "data":
            return { ...state, data: action.content };
    }
}

function ContentLayout() {
    // CreateContent
    const [operations, operationsConfig] = useReducer(configOperations, {
        title: "",
        isOpened: false,
        data: {}
    });
    const openDialogContents = (title: string, object: Object = {}) => {
        operationsConfig({ type: "title", content: title });
        operationsConfig({ type: "status", content: true });
        operationsConfig({ type: "data", content: object });
    };

    // AutoComplete Fields
    const [subtopic, subtopicConfig] = useReducer(configSubTopic, {
        value: "",
        isDisabled: true,
        data: []
    });

    const fillSubTopicValues = (event: SyntheticEvent, object: any) => {
        if (object) {
            SubTopicsService.getSubTopics(String(object.id)).then((response) => {
                subtopicConfig({ type: "value", content: "" });
                subtopicConfig({ type: "status", content: false });
                subtopicConfig({ type: "data", content: response.data });
            })
                .catch((err) => {
                    console.log(err);
                    setSnackBar({
                        isOpened: true,
                        message: "Erro ao carregar sub-tópicos",
                        button: "OK"
                    });
                });
        } else {
            subtopicConfig({ type: "value", content: "" });
            subtopicConfig({ type: "status", content: true });
            subtopicConfig({ type: "data", content: [] });
            setContentsList([]);
        }
    }

    const [contentsList, setContentsList] = useState(Array<ContentsModel>);

    const updateTableData = (event: SyntheticEvent, object: any) => {
        if (object) {
            let filtered: Array<ContentsModel> = [];

            ContentsService.getContents(object.topic.id, object.id).then((response) => {
                setContentsList(response.data)
                filtered = contentsList;

                filtered.forEach((row: any) => {
                    row.content = row.contentBR;
                });
            }).catch((err) => {
                console.log(err);
                setSnackBar({
                    isOpened: true,
                    message: "Erro ao carregar conteúdos",
                    button: "OK"
                });
            });

            subtopicConfig({ type: "value", content: object.label });
        } else {
            setContentsList([]);
            subtopicConfig({ type: "value", content: "" });
        }
    }

    //Content Table
    const showContent = (title: string, content: Object) => {
        setShowDialog({
            isOpened: true,
            title: title,
            data: content
        });
    };

    const openDialogDelete = (title: string, id: string) => {
        setDialogDelete({
            isOpened: true,
            title: title,
            data: id
        });
    };

    // Content Dialog
    const closeContent = (value: string) => {
        operationsConfig({ type: "status", content: false })
    };

    // Content Show Dialog
    const [showDialog, setShowDialog] = useState({
        isOpened: false,
        title: "",
        data: {}
    });

    const closeDialog = (value: string) => {
        setShowDialog({
            isOpened: false,
            title: showDialog.title,
            data: showDialog.data
        });
    };

    //Content Delete Dialog
    const [deleteDialog, setDialogDelete] = useState({
        isOpened: false,
        title: "",
        data: ""
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
                setDialogDelete({
                    isOpened: false,
                    title: deleteDialog.title,
                    data: deleteDialog.data
                });
            } else {
                setDialogDelete({
                    isOpened: false,
                    title: deleteDialog.title,
                    data: deleteDialog.data
                });
            }
        } else {
            setDialogDelete({
                isOpened: false,
                title: deleteDialog.title,
                data: deleteDialog.data
            });
        }
    }

    //SnackBar
    const [snackBar, setSnackBar] = useState({});

    return (
        <>
            <SnackContext.Provider value={{ snackBar: setSnackBar }}>
                <CreateContent createContent={openDialogContents} />
                <AutoCompleteFields
                    onChangeTopic={fillSubTopicValues}
                    onChangeSubTopic={updateTableData}
                    initialSubTopicValue={subtopic.value}
                    subTopicList={subtopic.data}
                    subTopicDisabled={subtopic.isDisabled}
                />
                <ContentTable
                    tableData={contentsList}
                    showFunction={showContent}
                    deleteFunction={openDialogDelete}
                    operationsFunction={openDialogContents} />
                <ContentDialog
                    open={operations.isOpened}
                    onClose={closeContent}
                    title={operations.title}
                    contentsData={operations.data}
                />
                <ContentShowDialog
                    open={showDialog.isOpened}
                    onClose={closeDialog}
                    title={showDialog.title}
                    content={showDialog.data}
                />
                <ContentDeleteDialog
                    open={deleteDialog.isOpened}
                    onClose={closeDialogDelete}
                    title={deleteDialog.title}
                    id={deleteDialog.data}
                />
                <SnackBar
                    snackProperties={snackBar}
                    setSnackBar={setSnackBar}
                />
            </SnackContext.Provider>
        </>
    )
}

export default ContentLayout;