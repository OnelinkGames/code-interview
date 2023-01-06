import { SyntheticEvent } from "react";
import ContentsModel from "../../shared/models/content";

export type PropsCreate = {
    createContent: (title: string, object?: DialogContents) => void;
}

export type ObjectId = {
    id: string;
}

export type PropsAutoComplete = {
    onChangeTopic: (event: SyntheticEvent, object: ObjectId) => void;
    onChangeSubTopic: (event: SyntheticEvent, object: ContentsModel) => void;
    initialTopicValue?: string;
    initialSubTopicValue: string;
    subTopicList: string[];
    subTopicDisabled: boolean;
}

export type DinamycMenuProps = {
    data: ContentsModel;
    openChange: (title: string, content: ContentsModel) => void;
    openDelete: (title: string, id: string) => void;
}

export type PaginationState = {
    currentPage: number;
    totalRows: number;
    rowsPerPage: number;
}

export type PaginationAction = {
    type: string;
    content: number;
}

export type TableContent = {
    contentBR: string;
    contentUSA: string;
}

export type TableProps = {
    tableData: ContentsModel[];
    showFunction: (title: string, content: TableContent) => void;
    deleteFunction: (title: string, id: string) => void;
    operationsFunction: (title: string, object?: DialogContents) => void;
}

export type OperationsState = {
    title: string;
    isOpened: boolean;
    data: Object;
}

export type OperationsAction = {
    type: string;
    content: string | boolean | Object;
}

export type SubTopicState = {
    value: string;
    isDisabled: boolean;
    data: string[];
}

export type SubTopicAction = {
    type: string;
    content: string | boolean | string[];
}

export type ShowDialogState = {
    isOpened: boolean;
    title: string;
    data: Object;
}

export type ShowDialogAction = {
    type: string;
    content: string | boolean | Object;
}

export type DeleteDialogState = {
    isOpened: boolean;
    title: string;
    data: string;
}

export type DeleteDialogAction = {
    type: string;
    content: string | boolean;
}

export type DialogContents = {
    id: string;
    contentBR: string;
    contentUSA: string;
} | undefined