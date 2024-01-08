import { Op } from "sequelize";
import { CronJob } from "@service/cron/classes";
import { ICronResponse } from "../interfaces";
import { ParticipacaoRepository, ParticipacaoResponsavelRepository, TarefaMovimentacaoRepository, TarefaRepository } from "atlas-orm/build/schemas/repositories";
import moment from "moment";
import { Notificacao } from "atlas-orm/build/schemas/models";
import Socket from '@service/socket/index';
import mailer from "@service/mailer";
import { MailerOptions } from "@service/mailer/interfaces/mailer";

class NotificationsCron extends CronJob {

    private tarefaMovRep: TarefaMovimentacaoRepository;
    private responsavelRep: ParticipacaoResponsavelRepository;
    private participacaoRep: ParticipacaoRepository;

    constructor() {

        super("0 8 * * 1-5");

        this.tarefaMovRep = new TarefaMovimentacaoRepository()
        this.responsavelRep = new ParticipacaoResponsavelRepository()
        this.participacaoRep = new ParticipacaoRepository()

    }

    async executeJob(): Promise<ICronResponse> {
        let user: any[] = []
        const date = new Date()
        const today = moment(date).format('YYYY/MM/DD')

        //* Envio de e-mail dos editais com data pro dia

        const wherePart = {
            data_edital: {
                [Op.gte]: today + ' 00:00:00',
                [Op.lte]: today + ' 23:59:59.999999'
            }
        }


        const participacao = await this.participacaoRep.findAll({
            where: wherePart,
            include: [
                {
                    association: 'aviso',
                    attributes: ['nome']
                },
                {
                    association: 'movimentacoes',
                    include: [
                        {
                            association: 'status',
                            attributes: ['nome']
                        }
                    ]
                }
            ]
        })

        participacao.map(async (item) => {

            const createNotification = Notificacao.create({
                conteudo: item.identificacao_pregao + ' - ' + item.data_edital,
                lida: false,
                usuario_id: 1,
                tipo_id: 3
            })

            const responsaveis = await this.responsavelRep.findAll({
                where: { participacao_id: item.id },
                include: [
                    {
                        association: 'usuario',
                        attributes: ['nick', 'email']
                    }
                ]
            })

            function createTableEditais(data: any) {
                let rowTables = data.map((item: any) => `
                <tr >
                    <td>${item.aviso.nome}</td>
                    <td>${moment(item.data_edital).format('DD/MM/YYYY HH:mm')}</td>
                    <td><a href="http://localhost:3000/participacao/andamento/${item.id}">Link</a></td>
                </tr>`).join("");
                return `<table style="border: 1px solid black; gap: 5px;">
                        <thead>
                            <tr>
                                <th>Projeto</th>
                                <th>Data e Hora</th>
                                <th>Link de acesso ao sistema</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowTables}
                        </tbody>
                    </table>`;
            }

            for (let u of responsaveis) {

                const nick = u?.usuario?.nick

                if (nick && !user.includes(nick)) {

                    user.push(nick)

                    const payload: MailerOptions = {
                        subject: 'Novas Notificações do Atlas',
                        to: 'bsc@sieg-ad.com.br',
                        content: {
                            'nick': nick,
                            'editais': createTableEditais(participacao),
                        }
                    }

                    mailer.sendMail('notificacao', payload)
                }

            }

            Socket.emitSocketEvent('notificacao', 'notificacao_enviada', createNotification, '1')

            user = []
        })

        //* Envio de e-mail das tarefas pendentes

        function createTableTarefas(data: any) {
            let rowTables = data.map((item: any) => `
            <tr >
                <td>${moment(item.data_prazo).format('DD/MM/YYYY HH:mm')}</td>
                <td>${item.tipo.grupo.nome}</td>
                <td>${item.tipo.nome}</td>
                <td>${item.descricao}</td>
            </tr>`).join("");
            return `<table style="border: 1px solid black; gap: 5px;">
                    <thead>
                        <tr>
                            <th>Prazo</th>
                            <th>Tarefa</th>
                            <th>Subtarefa</th>
                            <th>Detalhe</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowTables}
                    </tbody>
                </table>`;
        }

        const whereTar = { status_id: { [Op.ne]: 4 } }

        const tarefas = await this.tarefaMovRep.findAll({
            where: whereTar,
            include: [
                {
                    association: 'tarefa',
                    attributes: ['data_prazo', 'descricao'],
                    include: [
                        {
                            association: 'usuario',
                            attributes: ['nome', 'nick', 'email']
                        },
                        {
                            association: 'tipo',
                            attributes: ['nome', 'descricao'],
                            include: [
                                {
                                    association: 'grupo',
                                    attributes: ['nome']
                                }
                            ]
                        },
                    ]
                },
            ]
        })

        let usuarios: any = []
        for (let t of tarefas) {

            const nick = t.tarefa?.usuario?.nick

            if (nick && !usuarios.includes(nick)) {
                usuarios.push(nick);

                const tarefasDoUsuario = tarefas.filter(t => t.tarefa?.usuario?.nick === nick).map(t => t.tarefa)

                const payload = {
                    subject: 'Tarefas pendentes no Atlas',
                    to: 'bsc@sieg-ad.com.br',
                    content: {
                        'nick': nick,
                        'tarefas': createTableTarefas(tarefasDoUsuario),
                    }
                }

                mailer.sendMail('tarefas', payload);

            }
        }

        return {
            success: true
        }

    }

}

export default new NotificationsCron() 