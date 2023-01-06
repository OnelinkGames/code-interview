interface Topics {
    id: Number;
    description: string;
}
export default interface SubTopicsModel {
    id: Number;
    topic: Topics;
    label: string;
    criadoEm?: Date;
    criadoPor?: string;
    excluido?: boolean;
    excluidoEm?: string;
    excluidoPor?: string;
    ultimaAtualizacao?: Date;
}