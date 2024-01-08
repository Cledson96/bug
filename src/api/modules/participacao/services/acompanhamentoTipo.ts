import { ParticipacaoAcompanhamentoTipo } from 'atlasdb:models'
import { ParticipacaoAcompanhamentoTipoRepository } from 'atlasdb:repositories'
import { FindOptions } from 'sequelize'

class ParticipacaoAcompanhamentoTipoService {
    public ParticipacaoAcompanhamentoTipoRep: ParticipacaoAcompanhamentoTipoRepository

    constructor() {
        this.ParticipacaoAcompanhamentoTipoRep = new ParticipacaoAcompanhamentoTipoRepository()
    }

    async find(options?: FindOptions): Promise<ParticipacaoAcompanhamentoTipo[]> {
        return this.ParticipacaoAcompanhamentoTipoRep.findAll(options)
    }

    async findOne(options: FindOptions): Promise<ParticipacaoAcompanhamentoTipo> {
        if (!options.where) throw new Error('Where is required!')
        return await this.ParticipacaoAcompanhamentoTipoRep.findOne(options)
    }

    async create(data: ParticipacaoAcompanhamentoTipo): Promise<ParticipacaoAcompanhamentoTipo> {
        return await this.ParticipacaoAcompanhamentoTipoRep.create(data)
    }
}

export default new ParticipacaoAcompanhamentoTipoService()