interface Topics {
    id: string;
    description: string;
}

interface SubTopics {
    id: string;
    description: string;
}
export default interface ContentsModel {
    content?: string;
    label?: string;
    id: string;
    topic: Topics;
    subtopic: SubTopics;
    contentBR: string;
    contentUSA: string;
    criadoEm?: Date;
    criadoPor?: string;
    excluido?: boolean;
    excluidoEm?: string;
    excluidoPor?: string;
    ultimaAtualizacao?: Date;
}