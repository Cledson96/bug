import { NotificacaoCreationAttributes, NotificacaoUpdateAttributes } from "atlasdb:types";
import { Notificacao } from "atlasdb:models";
import { NotificacaoRepository } from "atlasdb:repositories";
import { FindOptions, Op } from "sequelize";

class NotificacaoService<T> {
    private notificacaoRep: NotificacaoRepository;
    constructor() {
        this.notificacaoRep = new NotificacaoRepository();
    }

    async find(): Promise<Notificacao[]> {
        return await this.notificacaoRep.findAll({
            include: [
                {
                    association: 'tipos',
                    attributes: ['nome']
                }
            ],
            order: [['created_at', 'DESC']]
        })
    }

    async findOne(options: FindOptions): Promise<Notificacao | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.notificacaoRep.findOne(options)
    }
    
    async create(payload: NotificacaoCreationAttributes): Promise<Notificacao | null> {
        if(payload.conteudo == undefined) throw new Error('Conteúdo é obrigatório')
        if(payload.lida == undefined) throw new Error('Lida é obrigatório')
        if(payload.usuario_id == undefined) throw new Error('Usuário_id é obrigatório')

        return await this.notificacaoRep.create(payload)
    }

    async update(id: number, payload: NotificacaoUpdateAttributes): Promise<[number]> {
        return await this.notificacaoRep.updateById(id, payload)
    }

    async markAsRead(id: number): Promise<[number]>{
        const markAsRead = this.notificacaoRep.updateById(id, { lida: true })
        return markAsRead
    }
}

export default new NotificacaoService();