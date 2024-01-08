import { ParticipacaoStatus } from "atlasdb:models";
import { ParticipacaoStatusRepository } from "atlasdb:repositories";
import { ParticipacaoStatusCreationAttributes } from "atlasdb:types";
import { Op } from "sequelize";

class ParticipacaoStatusService {
    private participacaoStatusRep: ParticipacaoStatusRepository;

    constructor() {
        this.participacaoStatusRep = new ParticipacaoStatusRepository()
    }

    async find(): Promise<ParticipacaoStatus[]> {
        return this.participacaoStatusRep.findAll({
            where: {
                ativo: true,
            },
        })        
    }

    async findAvailable(scope: string): Promise<ParticipacaoStatus[]> {
        return await this.participacaoStatusRep.scope(scope).findAll()
    }

    async findOne(id: number): Promise<ParticipacaoStatus> {
        return this.participacaoStatusRep.findOne({where: { id }})        
    }

    async create(payload: ParticipacaoStatusCreationAttributes): Promise<ParticipacaoStatus> {
        return await this.participacaoStatusRep.create(payload)
    }
}

export default new ParticipacaoStatusService();