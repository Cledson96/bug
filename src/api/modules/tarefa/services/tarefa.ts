import { Notificacao, Tarefa, TarefaMovimentacao, TarefaTipo, Usuario } from "atlasdb:models";
import { TarefaCreationAttributes, TarefaMovimentacaoCreationAttributes, TarefaMovimentacaoUpdateAttributes } from "atlasdb:types";
import { TarefaRepository, TarefaMovimentacaoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";
import { Transaction } from "sequelize";
import { Atlas } from "@atlas";
import Socket from '@service/socket/index';
import moment from 'moment'
class TarefaService {
    private tarefaRep: TarefaRepository;
    private tarefaMov: TarefaMovimentacaoRepository;

    constructor() {
        this.tarefaRep = new TarefaRepository();
        this.tarefaMov = new TarefaMovimentacaoRepository()
    }

    async find(): Promise<Tarefa[]> {
        return await this.tarefaRep.findAll({
            include: [
                { association: 'usuario', attributes: ['id', 'nome'] },
                { association: 'tipo', attributes: ['nome'], include: [{ association: 'grupo', attributes: ['nome'] }] },
                { 
                    association: 'movimentacoes', 
                    attributes: ['status_id'], 
                    order: [['id', 'DESC']], 
                    limit: 1, 
                    include: [
                        { association: 'status', attributes: ['nome', 'cor'] }
                    ] 
                },
            ]
        });
    }

    async findOne(options: FindOptions): Promise<Tarefa | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.tarefaRep.findOne(options)
    }

    async findTaskByProject(options: FindOptions): Promise<Tarefa[] | undefined> {
        const t: Transaction = await Atlas.transaction();
        try {
            const tarefas = await this.tarefaRep.findAll({
                ...options,
                include: [
                    { association: 'usuario', attributes: ['nome'] },
                    { association: 'tipo', attributes: ['nome'], include: [{ association: 'grupo', attributes: ['nome'] }] },
                    {
                        association: 'movimentacoes',
                        attributes: ['status_id'],
                        order: [['created_at', 'DESC']],
                        limit: 1,
                        include: [
                          { association: 'status', attributes: ['nome', 'cor'] }
                        ]
                    },
                ]
            });
            await t.commit();
            return tarefas;
        } catch (error) {
            await t.rollback();
            throw new Error(error);
        }
    }

    async create(payload: TarefaCreationAttributes) {
    
        
        
        const newTask = await this.tarefaRep.create(payload);


        const createNotification = Notificacao.create({
            conteudo: newTask.descricao + ' - ' + moment(newTask.data_prazo).format('DD/MM/YYYY'),
            lida: false,
            usuario_id: 1,
            tipo_id: 1
        })

        

        Socket.emitSocketEvent('notificacao', 'notificacao_enviada', newTask, '1')

        return newTask;
    }

    async update(tarefa_id: number, payload: TarefaMovimentacaoUpdateAttributes, newPrazo?: Date) {
        console.log( 'newPrazo', newPrazo);
        
        const lastMovimentacao = await TarefaMovimentacao.findOne({ where: { tarefa_id: tarefa_id }, order: [['id', 'DESC']] });
        const date = new Date();

        const currenttarefa = await Tarefa.findOne({ where: { id: tarefa_id } });
        const currentPrazo = new Date(currenttarefa?.data_prazo!);

        const hours = currentPrazo.getHours().toString().padStart(2, '0');
        const minutes = currentPrazo.getMinutes().toString().padStart(2, '0');

        const currentPrazoTime = `${hours}:${minutes}`;

        if(newPrazo) {
            const newPrazoDate = new Date(newPrazo + ' ' + currentPrazoTime);
            const updatePrazo = await Tarefa.update({ data_prazo: newPrazoDate }, { where: { id: tarefa_id } });

            if(!updatePrazo) throw new Error('Erro ao atualizar prazo da tarefa');
        }

        const newMovimentacao: TarefaMovimentacaoCreationAttributes = {
            data_inicio: date,
            tarefa_id: tarefa_id,
            status_id: payload.status_id!,
            usuario_id: payload.usuario_id!,
            justificativa: payload.justificativa!,
        }



        if (!lastMovimentacao) {
            await this.tarefaMov.create(newMovimentacao);
        }

        else if (lastMovimentacao && lastMovimentacao.data_fim === null) {
            await this.tarefaMov.update({ data_fim: date }, { where: { id: lastMovimentacao.id } });
            await this.tarefaMov.create(newMovimentacao);
        }

        if (payload.status_id === 4 || payload.status_id === 6) {
            await this.tarefaRep.update({ data_fim: date }, { where: { id: tarefa_id } });
        } 


    }
}

export default new TarefaService();

