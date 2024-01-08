import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "atlas-orm/src/core";
export interface UserEmailAttributes extends EntityAttributes {
    assunto: string;
    cc: string;
    cco: string;
    replyTo: string;
    mensagem: string;
    data_envio: Date;
    agendado: boolean;
    tipo_id: number;
    aviso_id: number;
    usuario_id: number;
}
export interface UserEmailUpdateAttributes extends EntityUpdateAttributes<UserEmailAttributes> {
}
export interface UserEmailCreationAttributes extends EntityCreationAttributes<UserEmailAttributes> {
}
