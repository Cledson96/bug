import { ParticipacaoAcompanhamento } from "atlasdb:models";
import { ParticipacaoAcompanhamentoRepository } from "atlasdb:repositories"
import { ParticipacaoAcompanhamentoAttributes } from "atlasdb:types";
import { FindOptions } from "sequelize";
import Socket from '@service/socket/index';

class ParticipacaoAcompanhamentoService {
    public ParticipacaoAcompanhamentoRep: ParticipacaoAcompanhamentoRepository;

    constructor() {
        this.ParticipacaoAcompanhamentoRep = new ParticipacaoAcompanhamentoRepository();
    }

    async find(id: number): Promise<ParticipacaoAcompanhamentoAttributes[]> {
        const comments =  this.ParticipacaoAcompanhamentoRep.findAll({
            where: { participacao_id: id },
            include: [
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                }
            ]
        })

        return comments;
    }

    async findOne(options: FindOptions): Promise<ParticipacaoAcompanhamentoAttributes | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.ParticipacaoAcompanhamentoRep.findOne(options)
    }

    async create(payload: ParticipacaoAcompanhamentoAttributes): Promise<ParticipacaoAcompanhamento | ParticipacaoAcompanhamento[]> {
        if(Array.isArray(payload)) return await this.ParticipacaoAcompanhamentoRep.bulkCreate(payload);
        return await this.ParticipacaoAcompanhamentoRep.create(payload)
    }
}

export default new ParticipacaoAcompanhamentoService();