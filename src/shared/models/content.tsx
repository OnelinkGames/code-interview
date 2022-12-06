interface Topics {
    id: Number;
    description: string;
}

interface SubTopics {
    id: Number;
    description: string;
}
export default interface ContentsModel {
    id: Number;
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