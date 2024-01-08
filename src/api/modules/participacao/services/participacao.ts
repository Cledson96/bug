import { 
    ParticipacaoRepository, ParticipacaoStatusRepository, ParticipacaoMovimentacaoRepository, ParticipacaoItemRepository, ParticipacaoGrupoItemRepository, ParticipacaoResponsavelRepository
} from "atlasdb:repositories";

import { Participacao, ParticipacaoStatus, ParticipacaoItem, ParticipacaoGrupoItem, ParticipacaoMovimentacao, ParticipacaoItemMovimentacao } from "atlasdb:models";
import { FindOptions } from "sequelize";
import mailer from "@service/mailer";
import { SendMailOptions } from "nodemailer";
import { ParticipacaoMovimentacaoCreationAttributes, ParticipacaoUpdateAttributes, UsuarioAttributes } from "atlas-orm/build/schemas/interfaces";
import { Atlas } from "@atlas";
import { Transaction } from "sequelize";
import { defaults } from 'pg';
class ParticipacaoServices {
    private participacaoRep: ParticipacaoRepository;
    private participacaoStatusRep: ParticipacaoStatusRepository;
    private participacaoMovimentacaoRep: ParticipacaoMovimentacaoRepository;
    private participacaoItemRep: ParticipacaoItemRepository;
    private participacaoGrupoItemRep: ParticipacaoGrupoItemRepository;
    private participacaoResponsavelRep: ParticipacaoResponsavelRepository;

    constructor() {
        this.participacaoRep = new ParticipacaoRepository();
        this.participacaoMovimentacaoRep = new ParticipacaoMovimentacaoRepository();
        this.participacaoStatusRep = new ParticipacaoStatusRepository();
        this.participacaoItemRep = new ParticipacaoItemRepository();
        this.participacaoGrupoItemRep = new ParticipacaoGrupoItemRepository();
        this.participacaoResponsavelRep = new ParticipacaoResponsavelRepository();
    }

    async getByScope(scope: string): Promise<Participacao[]> {
        const response = await this.participacaoRep.scope(scope).findAll();

        return response;
    }

    async find(options?: FindOptions): Promise<Participacao[]> {
        return this.participacaoRep.findAll({
            ...options,
            include: [
                {
                    association: 'cliente',
                    attributes: ['nome', 'cnpj'],
                },
                {
                    association: 'grupo',
                    attributes: ['nome', 'interno'],
                    include: [
                        {   
                            association: 'clientes', 
                            attributes: ['nome'],
                            include: [
                                {   
                                    association: 'municipio',
                                    attributes: ['nome']
                                }
                            ]    
                        }
                    ]
                },
                {
                    association: 'movimentacoes',
                    attributes: ['data_inicio', 'status_id'],
                    where: { data_fim: null },
                    limit: 1,
                    include: [
                        {   
                            association: 'status',
                            attributes: ['id',  'nome']
                        }
                    ]
                },
                {
                    association: 'aviso',
                    include: [
                        {   
                            association: 'unidade'   ,
                            include: [
                                {
                                    association: 'orgao'
                                }
                            ]
                        }
                    ]
                },
                {
                    association: "acompanhamentos",
                    attributes: ['comentario', 'ativo', 'tipo_id', 'usuario_id', 'created_at'],
                    order: [['id', 'DESC']],
                },
                {
                    association: "tarefas",
                    attributes: ['id', 'descricao', 'data_prazo', 'data_fim', "usuario_id", "participacao_id"],
                    order: [['id', 'DESC']],
                    include: [
                        {   
                            association: 'movimentacoes',
                            attributes: ['id', 'justificativa', 'data_inicio', 'data_fim', 'status_id'],
                            include: [
                                {   
                                    association: 'status',
                                    attributes: ['nome']
                                }
                            ]
                        }
                    ]
                },
                {
                    association: 'grupos_item',
                    attributes: ['id', 'numero'],
                    include: [
                        {
                            association: 'itens',
                            attributes: ['id', 'numero', 'quantidade'],
                        },
                        {
                            association: 'movimentacoes',
                            attributes: ['id', 'justificativa', 'data_inicio', 'data_fim', 'status_id'],
                            include: [
                                {   
                                    association: 'status',
                                    attributes: ['nome']
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['acompanhamentos', 'id', 'DESC']],
        })
    }

    async findOne(scope: string = 'default', options: FindOptions<Participacao>): Promise<Participacao> {
        if (!options.where) throw new Error('Where is required!');
        return await this.participacaoRep.scope(scope).findOne(options)
    }

    async update(id: number, payload: ParticipacaoUpdateAttributes, usuario?: UsuarioAttributes): Promise<[number] | undefined> {
        const { 
            aviso, 
            movimentacoes, 
            responsaveis,
            grupos_item,            
            ...projPayload 
        } = payload;

        const t: Transaction = await Atlas.transaction();
        try {
            if(!responsaveis && movimentacoes) throw new Error('Os responsáveis pelo projeto devem estar definidos')
            else if(responsaveis && movimentacoes) {
                for await(const r of responsaveis) {
                    const existingRecord = await this.participacaoResponsavelRep.findOne({
                        where: {
                            participacao_id: id,
                            tipo_id: r.tipo_id,
                        },
                        transaction: t,
                        });
                    
                        if (existingRecord) {
                        // If it exists, update the associated data
                        await existingRecord.update({
                            usuario_id: r.usuario_id,
                        }, { transaction: t });
                        } else {
                        // If it doesn't exist, create a new record
                        await this.participacaoResponsavelRep.create({
                            participacao_id: id,
                            tipo_id: r.tipo_id,
                            usuario_id: r.usuario_id,
                        }, { transaction: t });
                        }
                    
                }
            }

            if(movimentacoes) {
                const status = await this.participacaoStatusRep.findById(movimentacoes[0].status_id)

                if(status.justificativa && !movimentacoes[0].justificativa) {
                    throw new Error('Para movimentar este projeto para esta situação é obrigatório dar uma justificativa')
                }
                
                if(movimentacoes[0].status_id == 3 && (!grupos_item || grupos_item.length == 0) ) {
                    //* PARA MOVER PROJETO P/ PARTICIPACAO, O TAL DEVE CONTER ITENS CADASTRADOS
                    throw new Error('O projeto deve conter pelo menos um item para ser movido para participação')
                }
                
                const lastMov = await this.participacaoMovimentacaoRep.findOne({where: {data_fim: null, participacao_id: id}})

                if(lastMov.status_id == 5 && movimentacoes[0].status_id == 12 ) {
                    //* SE O STATUS FOR PÓS-LANCE, P/ MOVER P/ RESULTADO TODOS OS ITENS DEVEM ESTAR COM RESULTADO PREENCHIDO
                    const grupos_itens = await this.participacaoGrupoItemRep.findAll({
                        where: { participacao_id: id },
                        include: [
                            'itens',
                            'itens_concorrentes',
                            {
                                association: 'movimentacoes',
                                where: { data_fim: null },
                                limit: 1,
                                order: [['id', 'DESC']]
                            }
                        ]
                    })
                    for (const gi of grupos_itens) {
                        const flag_itens = gi.itens.some(el => !el.classificacao || !el.valor_final )
                        let flag_itens_concorrentes = false;
                        if(gi.classificacao > 1) {
                            let index = gi.itens_concorrentes.findIndex(el => el.classificacao == 1 && el.valor_final != null);
                            flag_itens_concorrentes = index == -1;
                        }

                        if(flag_itens || flag_itens_concorrentes) {
                            throw new Error('Para movimentar este projeto de pós-lance, primeiro preencha o resultado de todos seus respectivos itens')
                        }
                    }
                }

                if(lastMov.status_id != movimentacoes[0].status_id) {
                    const movimentacao: ParticipacaoMovimentacaoCreationAttributes = {
                        participacao_id: id,
                        data_inicio: new Date(),
                        usuario_id: usuario?.id ?? 1, // TODO! Adicionar usuario id
                        status_id: movimentacoes[0].status_id,
                        tarefas_automaticas: movimentacoes[0].tarefas_automaticas,
                        justificativa: movimentacoes[0].justificativa,
                        complemento: movimentacoes[0].complemento,
                    }  
                    await this.participacaoMovimentacaoRep.create(movimentacao, { transaction: t });
                }
            }
            
            const updated = await this.participacaoRep.update(projPayload, {
                where: {id},
                transaction: t
            } );
            await t.commit()
            return updated;
        } catch (error) {
            await t.rollback()
            throw new Error(error.message);
        }
    }
    
    async getStatus(participacao_id: number): Promise<ParticipacaoStatus[]> {
        return await this.participacaoStatusRep.findAll({
            include: [
                {
                    association: 'movimentacoes',
                    attributes: ['id', 'justificativa', 'data_inicio', 'data_fim', 'status_id'],
                    where: { participacao_id }
                },
            ]
        })
    }

    async getItens(scope: string = 'default', participacao_id: number): Promise<ParticipacaoItem[]> {
        return await this.participacaoItemRep.findAll({
            include: [
                {
                    association: 'modelo',
                    include: [
                        {
                            association: 'marca'
                        }
                    ]
                },
                {
                    association: 'grupo_item',
                    include: [
                        {
                            association: 'participacao',
                            attributes: ['cliente_id']
                        },
                        {
                            association: 'movimentacoes',
                            where: { data_fim: null },
                            order: [['id', 'DESC']],
                            limit: 1,
                            required: true
                        }
                    ],
                    where: { participacao_id }
                }
            ],
        });
    }

    async getParticipacaoItens(id: number): Promise<Participacao> {
        return await this.participacaoRep.findOne({
            where: { id },
            include: [
                {
                    association: 'grupo_item',
                    include: [
                        {
                            association: 'itens',
                            include: [
                                {
                                    association: 'modelo',
                                    include: [
                                        {
                                            association: 'marca'
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                }
            ],
        });
    }

    async sendEmail(options: SendMailOptions): Promise<void> {
        try {
           
            const { subject, html } = await mailer.templates('suspenso_projetosEletronicos', 
            { SAUDACAO: 'Bom dia',
              ORGAO: 'PREFEITURA LALALALA',
              OBJETO: 'Objeto do projeto', 
              PROCESSO: '1234567890',
              ULTIMO_ENVIO: '01/01/2020',
              LINKS_REGISTRADOS: 'link1, link2, link3'
            })
            
            const emailOptions = {
                ...options,
                html: html,
                subject: subject
            }

            // const send = await mailer.sendMail(emailOptions);
 
            // console.log(send);
            
        } catch (error) {
           console.log(error);
        }
    }

    async getGruposItens(scope: string = 'default', participacao_id: number): Promise<ParticipacaoGrupoItem[]> {
        return await this.participacaoGrupoItemRep.findAll({
            include: [
                {
                    association: 'itens',
                    include: [
                        {
                            association: 'modelo',
                            include: [
                                {
                                    association: 'marca'
                                }
                            ]
                        }
                    ],
                }
            ],
            where: { participacao_id }
        });
    }
}


export default new ParticipacaoServices();