import { ParticipacaoMovimentacao } from "atlasdb:models";
import { ParticipacaoMovimentacaoRepository } from "atlasdb:repositories";
import { ParticipacaoMovimentacaoCreationAttributes } from "atlasdb:types";
import { Op } from "sequelize";

class ParticipacaoMovimentacaoService {
    private projMovimentacaoRep: ParticipacaoMovimentacaoRepository;

    constructor() {
        this.projMovimentacaoRep = new ParticipacaoMovimentacaoRepository()
    }

    async find(usuario_id: any | null, date_start: Date, date_end: Date): Promise<ParticipacaoMovimentacao[]> {
        const whereClause: any =  {
            data_inicio: {
                [Op.gte]: date_start + ' 00:00:00',
                [Op.lte]: date_end + ' 23:59:59.999999',
            }
        }

        if(usuario_id !== null && usuario_id.length > 0){
            whereClause.usuario_id = usuario_id
        }

        return this.projMovimentacaoRep.findAll({
                where: whereClause,
                include: [
                    {
                        association: 'status',
                        attributes: ['nome']
                    },
                    {
                        association: 'participacao',
                        attributes: ['objeto', 'data_edital', 'nova_lei']
                    },
                    {
                        association: 'usuario',
                        attributes: ['nome', 'nick']
                    },
                ]
        })        
    }

    async findOne(id: number): Promise<ParticipacaoMovimentacao> {
        return this.projMovimentacaoRep.findOne({where: { id }})        
    }

    async move(payload: ParticipacaoMovimentacaoCreationAttributes): Promise<ParticipacaoMovimentacao> {
        return await this.projMovimentacaoRep.create(payload)
    }
}

export default new ParticipacaoMovimentacaoService();