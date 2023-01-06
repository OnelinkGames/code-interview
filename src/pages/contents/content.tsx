import React, { SyntheticEvent, useContext, useEffect, useState, MouseEvent, useReducer, ReducerWithoutAction } from 'react'
import Button from '@mui/material/Button';
import ContentShowDialog from './show-dialog';
import ContentDeleteDialog from './delete-dialog';
import SnackBar from '../../shared/components/snack-bar';
import ContentsModel from '../../shared/models/content';
import ContentDialog from './dialog';
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
import TopicList from '../../shared/components/topic-list';
import SubTopicList from '../../shared/components/sub-topic-list';
import SnackContext from '../../shared/components/snack-context';
import { 
    PropsCreate, 
    PropsAutoComplete, 
    DinamycMenuProps, 
    PaginationState,
    PaginationAction,
    TableProps,
    OperationsState,
    OperationsAction,
    SubTopicState,
    SubTopicAction,
    ShowDialogState,
    ShowDialogAction,
    DeleteDialogState,
    DeleteDialogAction,
    DialogContents,
    ObjectId
 } from "./content.types"
import './content.scss';

function CreateContent<T>(props: PropsCreate) {
    const { createContent } = props;

    return (
        <div className="create-button">
            <Button onClick={() => createContent("Criar um novo conteúdo")}
                variant="contained">Cadastrar um conteúdo</Button>
        </div>
    )
}

export function AutoCompleteFields(props: PropsAutoComplete) {
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

function DinamycMenu(props: DinamycMenuProps) {
    const { data, openChange, openDelete } = props;

    const [actionsEl, setActionsEl] = useState<null | HTMLElement>(null);

    const openActions = (event: MouseEvent<HTMLButtonElement>) => {
        setActionsEl(event.currentTarget);
    };

    const closeActions = () => {
        setActionsEl(null);
    };

    const localOpenChange = (title: string, object: ContentsModel) => {
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
                id="action-menu"
                anchorEl={actionsEl}
                open={Boolean(actionsEl)}
                onClose={closeActions}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    onClick={() =>
                        localOpenChange(
                            data.topic.description + ' - ' + data.subtopic.description,
                            data
                        )}>
                    <EditIcon sx={{
                        marginRight: '10px',
                        color: "blue"
                    }} />Editar</MenuItem>
                <MenuItem
                    onClick={() =>
                        localOpenDelete(
                            data.topic.description + ' - ' + data.subtopic.description,
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

function configPagination(state: PaginationState, action: PaginationAction): PaginationState {
    switch (action.type) {
        case "page":
            return { ...state, currentPage: action.content };
        case "total":
            return { ...state, totalRows: action.content };
        case "rowsPerPage":
            return { ...state, rowsPerPage: action.content };
        default:
            return { ...state };
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
        if (tableData.length > 0) {
            paginationConfig({ type: "total", content: tableData.length });
            filterTable();
        }
    }, [tableData]);

    const dialogDelete = (title: string, id: string) => {
        deleteFunction(title, id);
    }

    const dialogEdit = (title: string, content: ContentsModel) => {
        operationsFunction("Alterar o conteúdo", content);
    }

    const filterTable = () => {
        let finalRow = (pagination.currentPage + 1) * pagination.rowsPerPage;
        let initialRow = (finalRow - pagination.rowsPerPage);

        let filtered = tableData.filter((row, index) => {
            return index >= initialRow || index <= finalRow;
        });

        setFilteredTable(filtered);
    };

    const paginationInit: PaginationState = {
        currentPage: 0,
        totalRows: 0,
        rowsPerPage: 10
    }

    // Table Pagination Data
    const [pagination, paginationConfig] = useReducer(configPagination, paginationInit);

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
                            {filteredTable.map((row: ContentsModel) => (
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
                                        <DinamycMenu
                                            data={row}
                                            openChange={dialogEdit}
                                            openDelete={dialogDelete}
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

function configOperations(state: OperationsState, action: OperationsAction): OperationsState {
    switch (action.type) {
        case "title":
            return { ...state, title: typeof action.content == "string" ? action.content : "" };
        case "status":
            return { ...state, isOpened: typeof action.content == "boolean" ? action.content : false };
        case "data":
            return { ...state, data: action.content };
        default:
            return { ...state }
    }
}

function configSubTopic(state: SubTopicState, action: SubTopicAction): SubTopicState {
    switch (action.type) {
        case "value":
            return { ...state, value: typeof action.content == "string" ? action.content : "" };
        case "status":
            return { ...state, isDisabled: typeof action.content == "boolean" ? action.content : false };
        case "data":
            return { ...state, data: Array.isArray(action.content) ? action.content : [] };
        default:
            return { ...state };
    }
}

function configShowDialog(state: ShowDialogState, action: ShowDialogAction) {
    switch (action.type) {
        case "status":
            return { ...state, isOpened: typeof action.content == "boolean" ? action.content : false };
        case "title":
            return { ...state, title: typeof action.content == "string" ? action.content : "" };
        case "data":
            return { ...state, data: action.content };
        default:
            return { ...state };
    }
}

function configDeleteDialog(state: DeleteDialogState, action: DeleteDialogAction) {
    switch (action.type) {
        case "status":
            return { ...state, isOpened: typeof action.content == "boolean" ? action.content : false };
        case "title":
            return { ...state, title: typeof action.content == "string" ? action.content : "" };
        case "data":
            return { ...state, data: typeof action.content == "string" ? action.content : "" };
        default:
            return { ...state };
    }
}

function ContentLayout() {
    const OperationsInit: OperationsState = {
        title: "",
        isOpened: false,
        data: {}
    }

    // CreateContent
    const [operations, operationsConfig] = useReducer(configOperations, OperationsInit);
    const openDialogContents = (title: string, object: DialogContents = undefined) => {
        let editObject = object ? JSON.parse(JSON.stringify(object)) : {};

        if (object?.hasOwnProperty('id')) {
            try {
                editObject.contentBR = atob(object.contentBR);
                editObject.contentUSA = atob(object.contentUSA);
            } catch (err) {
                editObject.contentBR = "";
                editObject.contentUSA = "";

                console.log("Não foi possivel tratar a string", err);
            }
        } else {
            editObject.contentBR = "";
            editObject.contenteUSA = "";
        }

        operationsConfig({ type: "title", content: title });
        operationsConfig({ type: "status", content: true });
        operationsConfig({ type: "data", content: editObject });
    };

    const SubTopicInit: SubTopicState = {
        value: "",
        isDisabled: true,
        data: []
    }

    // AutoComplete Fields
    const [subtopic, subtopicConfig] = useReducer(configSubTopic, SubTopicInit);

    const fillSubTopicValues = (event: SyntheticEvent, object: ObjectId) => {
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

    const updateTableData = (event: SyntheticEvent, object: ContentsModel) => {
        if (object) {
            let filtered: Array<ContentsModel> = [];

            ContentsService.getContents(object.topic.id, object.id).then((response) => {
                setContentsList(response.data)
                filtered = contentsList;

                filtered.forEach((row: ContentsModel) => {
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

            subtopicConfig({ type: "value", content: typeof object.label == "string" ? object.label : "" });
        } else {
            setContentsList([]);
            subtopicConfig({ type: "value", content: "" });
        }
    }

    //Content Table
    const showContent = (title: string, content: { contentBR: string, contentUSA: string }) => {
        let showContent: { contentBR: string, contentUSA: string };

        try {
            showContent = {
                contentBR: atob(content.contentBR),
                contentUSA: atob(content.contentUSA),
            }
        } catch (err) {
            showContent = {
                contentBR: "",
                contentUSA: ""
            }

            console.log("Não foi possivel tratar a string", err);
        }

        showDialogConfig({ type: "status", content: true });
        showDialogConfig({ type: "title", content: title });
        showDialogConfig({ type: "data", content: showContent });
    };

    const openDialogDelete = (title: string, id: string) => {
        deleteDialogConfig({ type: "status", content: true });
        deleteDialogConfig({ type: "title", content: title });
        deleteDialogConfig({ type: "data", content: id.toString() });
    };

    // Content Dialog
    const closeContent = (value: string) => {
        operationsConfig({ type: "status", content: false })
    };

    const ShowDialogInit: ShowDialogState = {
        isOpened: false,
        title: "",
        data: {}
    }

    // Content Show Dialog
    const [showDialog, showDialogConfig] = useReducer(configShowDialog, ShowDialogInit);

    const closeDialog = (value: string) => {
        showDialogConfig({ type: "status", content: false });
    };

    const DeleteDialogInit: DeleteDialogState = {
        isOpened: false,
        title: "",
        data: ""
    }

    //Content Delete Dialog
    const [deleteDialog, deleteDialogConfig] = useReducer(configDeleteDialog, DeleteDialogInit);

    const closeDialogDelete = (value: string) => {
        if (value) {
            let dialogValue = JSON.parse(value);
            if (dialogValue.status == "success") {
                setSnackBar({
                    isOpened: true,
                    message: dialogValue.message,
                    button: "OK"
                });
                deleteDialogConfig({ type: "status", content: false });
            } else {
                deleteDialogConfig({ type: "status", content: false });
            }
        } else {
            deleteDialogConfig({ type: "status", content: false });
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