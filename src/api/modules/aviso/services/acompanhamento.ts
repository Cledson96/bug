import { AvisoAcompanhamentoCreationAttributes, AvisoAcompanhamentoUpdateAttributes } from "atlasdb:types";
import { AvisoAcompanhamento, Notificacao, Usuario } from "atlasdb:models";
import { AvisoAcompanhamentoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";
import Socket from '@service/socket/index';
import moment from 'moment'
import { retail } from "googleapis/build/src/apis/retail";

class AvisoAcompanhamentoService {
    private avisoAcompanhamentoRep: AvisoAcompanhamentoRepository;
    constructor() {
        this.avisoAcompanhamentoRep = new AvisoAcompanhamentoRepository();
    }

    async find(): Promise<AvisoAcompanhamento[]> {
        const listAcompanhamentos =  await this.avisoAcompanhamentoRep.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['nome', 'nick'],
                }
            ]
        })
        return listAcompanhamentos
    }

    async findAcompanhamentos(id: number): Promise<AvisoAcompanhamento[]>{
        const listAcompanhamentos = await this.avisoAcompanhamentoRep.findAll({
            where: { aviso_id: id},
            include: [
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick'],
                }
            ]
        })

        return listAcompanhamentos
    }

    async findOne(options: FindOptions): Promise<AvisoAcompanhamento | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.avisoAcompanhamentoRep.findOne(options)
    }
    
    async create(payload: AvisoAcompanhamentoCreationAttributes): Promise<AvisoAcompanhamento | null> {
        
        const createFollowing = await this.avisoAcompanhamentoRep.create(payload)

        Socket.emitSocketEvent('notificacao', 'comentario-criado', createFollowing )

        return createFollowing

    }

    async update(id: number, payload: AvisoAcompanhamentoUpdateAttributes): Promise<[number]> {
        return await this.avisoAcompanhamentoRep.updateById(id, payload)
    }
}

export default new AvisoAcompanhamentoService();