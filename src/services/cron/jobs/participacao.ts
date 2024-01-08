import { CronJob } from "@service/cron/classes";
import { ICronResponse } from "../interfaces";
import { ParticipacaoMovimentacaoRepository, ParticipacaoRepository } from "atlas-orm/build/schemas/repositories";
import { Op } from "sequelize";
import { ParticipacaoMovimentacaoCreationAttributes } from "atlas-orm/build/schemas/interfaces";
import { Transaction } from "sequelize";
import { Atlas } from "@atlas";

class ParticipacaoCron extends CronJob {
    private participacaoRep: ParticipacaoRepository;
    private participacaoMovimentacaoRep: ParticipacaoMovimentacaoRepository;

    constructor() {
        super("0 7,19 * * *");

        this.participacaoRep = new ParticipacaoRepository();
        this.participacaoMovimentacaoRep = new ParticipacaoMovimentacaoRepository()
    }

    async executeJob(): Promise<ICronResponse> {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const yesterday_start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0)
        const today_end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

        const t: Transaction = await Atlas.transaction()
        try {
            const projetos = await this.participacaoRep.findAll({
                include: [{
                    association: 'movimentacoes',
                    where: { data_fim: null },
                    order: [['id', 'DESC']],
                }],
                where: { 
                    '$movimentacoes.status_id$': {
                        [Op.in]: [3, 4]
                    },
                    '$movimentacoes.data_fim$': null,
                    data_edital:  {
                        [Op.gte]: yesterday_start,
                        [Op.lte]: today_end
                    },
                },
                transaction: t
            })
            if(projetos.length == 0) return { success: true }

            const payload_movimentacoes: ParticipacaoMovimentacaoCreationAttributes[] = []
            for(const p of projetos) {
                const isToday = new Date(p.data_edital).getDate() == today.getDate();

                if(isToday && p.movimentacoes[0].status_id == 3) {
                    payload_movimentacoes.push({
                        data_inicio: new Date(),
                        status_id: 4, //? STATUS LANCE
                        usuario_id: 1, //* SISTEMA
                        participacao_id: p.id,
                    })
                }
                else if(!isToday && p.movimentacoes[0].status_id == 4) {
                    payload_movimentacoes.push({
                        data_inicio: new Date(),
                        status_id: 5, //? STATUS POS-LANCE
                        usuario_id: 1, //* SISTEMA
                        participacao_id: p.id,
                    })
                }
            }
            await this.participacaoMovimentacaoRep.bulkCreate(payload_movimentacoes, { transaction: t });

            await t.commit()

            return {
                success: true
            }
        } catch (error) {
            await t.rollback()
            
            return {
                success: false,
                error
            }
        }
    }

}


export default new ParticipacaoCron();