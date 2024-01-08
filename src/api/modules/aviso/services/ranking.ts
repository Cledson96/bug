import { AvisoRankingCreationAttributes, AvisoRankingUpdateAttributes } from "atlasdb:types";
import { AvisoRanking } from "atlasdb:models";
import { AvisoRankingRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";
import Socket from '@service/socket/index';


class AvisoRankingService {
    private AvisoRankingRep: AvisoRankingRepository;
    constructor() {
        this.AvisoRankingRep = new AvisoRankingRepository();
    }

    async find(): Promise<AvisoRanking[]> {
        return await this.AvisoRankingRep.findAll()
    }

    async findOne(options: FindOptions): Promise<AvisoRanking | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.AvisoRankingRep.findOne(options)
    }
    
    async create(aviso_id: number, tag_ids: number[]): Promise<AvisoRanking[] | null> {

        const payload: AvisoRankingCreationAttributes[] = tag_ids.map(id => {
            return {
                aviso_id,
                tag_id: id      
            }
        })

        const createRanking = await this.AvisoRankingRep.bulkCreate(payload)
        
        Socket.emitSocketEvent('notificacao', 'notificacao_enviada', createRanking, '1')
        
        return createRanking
    }

    async update(id: number, payload: AvisoRankingUpdateAttributes): Promise<[number]> {
        return await this.AvisoRankingRep.updateById(id, payload)
    }

    async delete(id: number): Promise<AvisoRanking | number> {
        return await this.AvisoRankingRep.deleteById(id)
    }
}

export default new AvisoRankingService();