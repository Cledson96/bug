import { Tarefa, TarefaMovimentacao, TarefaStatus } from "atlasdb:models";
import { TarefaMovimentacaoAttributes, TarefaMovimentacaoUpdateAttributes } from "atlasdb:types";
import { TarefaMovimentacaoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";
import { Op } from "sequelize";
import Socket from '@service/socket/index';


class TarefaMovimentacaoService {
    private tarefaMovimentacaoRep: TarefaMovimentacaoRepository;

    constructor() { 
        this.tarefaMovimentacaoRep = new TarefaMovimentacaoRepository();
    }

    async find(): Promise<TarefaMovimentacao[]> {
        return await this.tarefaMovimentacaoRep.findAll({
            include: [
                {
                    association: 'status',
                    attributes: ['nome'],
                },
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                },
                {
                    association: 'tarefa',
                    attributes: ['descricao'],
                    include: [
                        {
                            association: 'tipo',
                            attributes: ['nome'],
                            include: [
                                {
                                    association: 'grupo',
                                    attributes: ['nome']
                                }
                            ]
                        }
                    ]
                },
            ]
        });
    }

    async findMov(usuario_id: any, date_start: Date, date_end: Date): Promise<TarefaMovimentacao[]>{
        const where: any = {
            data_inicio: {
                [Op.gte]: date_start + ' 00:00:00',
                [Op.lte]: date_end + ' 23:59:59.999999'
            }
        }

        if(usuario_id !== null && usuario_id.length > 0){
            where.usuario_id = usuario_id
        }
        
        return await this.tarefaMovimentacaoRep.findAll({
            where,
            include:[
                {
                    association: 'status',
                    attributes: ['nome', 'cor'],
                },
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                },
                {
                    association: 'tarefa',
                    attributes: ['descricao'],
                    include: [
                        {
                            association: 'tipo',
                            attributes: ['nome'],
                            include: [
                                {
                                    association: 'grupo',
                                    attributes: ['nome']
                                }
                            ]
                        }
                    ]
                },
            ],
        })
    }

    async findOne(options: FindOptions): Promise<TarefaMovimentacao | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.tarefaMovimentacaoRep.findOne(options)
    }

    async create(payload: TarefaMovimentacaoAttributes | TarefaMovimentacaoAttributes[]): Promise<TarefaMovimentacao | TarefaMovimentacao[] | null> {
        if(Array.isArray(payload)) return await this.tarefaMovimentacaoRep.bulkCreate(payload);
        
        const createTask = await this.tarefaMovimentacaoRep.create(payload);

        Socket.emitSocketEvent('notificacao', 'notificacao_enviada', createTask, '1')

        return createTask
    }

    async update(id: number, payload: TarefaMovimentacaoUpdateAttributes): Promise<[number]> {
        return await this.tarefaMovimentacaoRep.updateById(id, payload);
    }

}

export default new TarefaMovimentacaoService();