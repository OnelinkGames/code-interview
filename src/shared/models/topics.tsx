export default interface TopicsModel {
    id: Number;
    label: string;
    criadoEm?: Date;
    criadoPor?: string;
    excluido?: boolean;
    excluidoEm?: string;
    excluidoPor?: string;
    ultimaAtualizacao?: Date;
}