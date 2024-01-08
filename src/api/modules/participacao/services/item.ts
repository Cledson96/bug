import { ParticipacaoGrupoItemRepository, MarcaRepository, ModeloRepository, ParticipacaoRepository, TarefaRepository, ParticipacaoItemStatusRepository, ParticipacaoItemConcorrenteRepository, ParticipacaoItemMovimentacaoRepository, ParticipacaoMovimentacaoRepository } from "atlasdb:repositories";
import { ParticipacaoCreationAttributes, ParticipacaoGrupoItemCreationAttributes, ParticipacaoItemCreationAttributes, ParticipacaoItemMovimentacaoCreationAttributes, ParticipacaoItemUpdateAttributes, ParticipacaoMovimentacaoAttributes, ParticipacaoMovimentacaoCreationAttributes, ParticipacaoResponsavelAttributes, TarefaAttributes, TarefaCreationAttributes, TarefaMovimentacaoAttributes, UsuarioAttributes } from "atlasdb:types";
import { ParticipacaoItem, ParticipacaoItemConcorrente, ParticipacaoItemStatus, Tarefa, TarefaMovimentacao, TarefaStatus, TarefaTipo, Usuario } from "atlasdb:models";
import { ParticipacaoItemRepository } from "atlasdb:repositories";
import { FindOptions, Op, where } from "sequelize";
import { Transaction } from "sequelize";
import { Atlas } from "@atlas";

class ItemService {
    private participacaoRep: ParticipacaoRepository;
    private participacaoMovimentacaoRep: ParticipacaoMovimentacaoRepository;
    private itemRep: ParticipacaoItemRepository;
    private tarefaRep: TarefaRepository;
    private grupoItemRep: ParticipacaoGrupoItemRepository;
    private marcaRep: MarcaRepository;
    private modeloRep: ModeloRepository;
    private itemStatusRep: ParticipacaoItemStatusRepository;
    private itemConcorrenteRep: ParticipacaoItemConcorrenteRepository;
    private itemMovimentacaoRep: ParticipacaoItemMovimentacaoRepository;
    
    constructor() {
        this.participacaoRep = new ParticipacaoRepository();
        this.participacaoMovimentacaoRep = new ParticipacaoMovimentacaoRepository();
        this.itemRep = new ParticipacaoItemRepository();
        this.tarefaRep = new TarefaRepository();
        this.grupoItemRep = new ParticipacaoGrupoItemRepository();
        this.marcaRep = new MarcaRepository();
        this.modeloRep = new ModeloRepository();
        this.itemStatusRep = new ParticipacaoItemStatusRepository()
        this.itemConcorrenteRep = new ParticipacaoItemConcorrenteRepository();
        this.itemMovimentacaoRep = new ParticipacaoItemMovimentacaoRepository();
    }

    async find(options?: FindOptions): Promise<ParticipacaoItem[]> {
        return await this.itemRep.findAll(options);
    }

    async findOne(options: FindOptions): Promise<ParticipacaoItem | null> {
        if (!options.where) throw new Error('Where is required!');
        
        return await this.itemRep.findOne({
            ...options,
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
                            attributes: ['cliente_id'],
                            include: [
                                {
                                    association: 'aviso',
                                    include: ['modo_disputa']
                                }
                            ]
                        },
                        {
                            association: 'itens'
                        },
                        {
                            association: 'itens_concorrentes',
                            include: [
                                'concorrente',
                                {
                                    association: 'modelo',
                                    include: ['marca']
                                }
                            ]
                        },
                        {
                            association: 'movimentacoes',
                            attributes: ['status_id'],
                            where: { data_fim: null },
                            limit: 1,
                            order: [['id', 'DESC']]
                        }
                    ],
                }
            ],
        });
    }

    async findStatusDisponiveis(options?: FindOptions): Promise<ParticipacaoItemStatus[]> {
        return this.itemStatusRep.findAll(options)
    }

    async create(participacao_id: number, payload: ParticipacaoItemCreationAttributes, usuario: UsuarioAttributes): Promise<ParticipacaoItem | undefined>  {
        const transaction: Transaction = await Atlas.transaction();
        try {
            let projeto = await this.participacaoRep.findById(participacao_id, {
                include: [
                    {
                        association: 'movimentacoes',
                        order: [['id', 'ASC']]
                    },
                    {
                        association: 'responsaveis',
                        order: [['id', 'ASC']]
                    },
                    {
                        association: 'tarefas',
                        order: [['id', 'ASC']],
                        include: [
                            {
                                association: 'movimentacoes',
                                order: [['id', 'ASC']]
                            },
                        ]
                    }
                ],
            });

            if(!payload.grupo_item) throw new Error('Preencha todas informações obrigatórias')
            
            if(!projeto.cliente_id) { 
                //* ATUALIZA PARTICIPAÇÃO CASO AINDA NÃO POSSUI VÍNCULO A UM CLIENTE
                projeto.cliente_id = payload.grupo_item!.participacao!.cliente_id!;
                await this.participacaoRep.update({cliente_id: payload.grupo_item!.participacao!.cliente_id!}, { where: { id: participacao_id }, transaction });
            }
            else if(projeto.cliente_id != payload.grupo_item!.participacao!.cliente_id!){
                //* CRIA NOVA PARTICIPAÇÃO CASO VINCULADA A UM NOVO CLIENTE
                const { id, created_at, updated_at, cliente, aviso, responsaveis, movimentacoes, tarefas } = projeto

                //! ASSIM CRIA POREM DUPLICA TAREFAS POR CONTA DO HOOKS = FALSE NÃO FUNCIONAR PARA ASSOCIAÇÕES
                // const projetoPayload: ParticipacaoCreationAttributes = {
                //     ...rest,
                //     cliente_id: payload.grupo_item?.participacao?.cliente_id!,
                //     responsaveis: responsaveis?.map((el: ParticipacaoResponsavelAttributes) => {
                //         const { id, participacao_id, created_at, updated_at, ...rest } = el;
                //         return rest
                //     }) ?? [], 
                //     movimentacoes: movimentacoes?.map((el: ParticipacaoMovimentacaoAttributes) => {
                //         const { id, participacao_id, created_at, updated_at, ...rest } = el;
                //         return rest
                //     }) ?? [], 
                //     tarefas: tarefas?.map((el: TarefaAttributes) => {
                //         const { id, participacao_id, created_at, updated_at, movimentacoes, ...rest } = el;
                //         return {
                //             ...rest,
                //             movimentacoes: movimentacoes?.map((el: TarefaMovimentacaoAttributes) => {
                //                 const { id, tarefa_id, created_at, updated_at,  ...rest } = el;
                //                 return rest
                //             })
                //         }
                //     }) ?? []
                // }
                // projeto = await this.participacaoRep.create(projetoPayload, { 
                //     include: [
                //         'movimentacoes',
                //         'responsaveis',
                //         {                            
                //             association: 'tarefas',
                //             include: ['movimentacoes'],
                //         }
                //     ],
                //     hooks: false,
                //     transaction
                // })
                const projetoPayload: ParticipacaoCreationAttributes = {
                    aviso_id: projeto.aviso_id,
                    cliente_grupo_id: projeto.cliente_grupo_id,
                    cliente_id: payload.grupo_item?.participacao?.cliente_id,
                    data_edital: projeto.data_edital,
                    objeto: projeto.objeto,
                    identificacao_pregao: projeto.identificacao_pregao,
                    importante: projeto.importante,
                    nova_lei: projeto.nova_lei,
                    responsaveis: responsaveis?.map((el: ParticipacaoResponsavelAttributes) => {
                        return {
                            tipo_id: el.tipo_id,
                            usuario_id: el.usuario_id,
                        }
                    }) ?? [],
                }

                projeto = await this.participacaoRep.create(projetoPayload, { 
                    include: ['responsaveis'],
                    hooks: false,
                    transaction
                })
                
                const movimentacoesPayload: ParticipacaoMovimentacaoCreationAttributes[] = movimentacoes?.map((el: ParticipacaoMovimentacaoAttributes) => {
                    return {
                        participacao_id: projeto.id,
                        data_inicio: el.data_inicio,
                        status_id: el.status_id,
                        usuario_id: el.usuario_id,
                        complemento: el.complemento,
                        data_fim: el.data_fim,
                        justificativa: el.justificativa,
                        tarefas_automaticas: el.tarefas_automaticas,
                    }
                }) ?? []
                await this.participacaoMovimentacaoRep.bulkCreate(movimentacoesPayload, { hooks: false, transaction })

                const tarefasPayload: TarefaCreationAttributes[] =  tarefas?.map((el: TarefaAttributes) => {
                    return {
                        participacao_id: projeto.id,
                        tipo_id: el.tipo_id,
                        usuario_id: el.usuario_id,
                        descricao: el.descricao,
                        data_prazo: el.data_prazo,
                        data_fim: el.data_fim,
                        movimentacoes: el.movimentacoes?.map((el: TarefaMovimentacaoAttributes) => {
                            return {
                                justificativa: el.justificativa,
                                complemento: el.complemento,
                                data_inicio: el.data_inicio,
                                data_fim: el.data_fim,
                                status_id: el.status_id,
                                usuario_id: el.usuario_id,
                            }
                        })
                    }
                }) ?? []
                await this.tarefaRep.bulkCreate(tarefasPayload, {
                    include: ['movimentacoes'],
                    hooks: false,
                    transaction
                })

            }
            
            const [grupoItem] = await this.grupoItemRep.findOrCreate({
                where: { 
                   numero: payload.grupo_item!.numero,
                   participacao_id: projeto.id 
                },
                defaults: {
                    numero: payload.grupo_item!.numero,
                    descricao: payload.grupo_item?.descricao,
                    participacao_id: projeto.id,
                },
                transaction
            });
            if(payload.grupo_item.classificacao) {
                grupoItem.classificacao = payload.grupo_item.classificacao;
                await grupoItem.save({ transaction })
            }

            if(!payload.modelo && !payload.modelo!.marca ) throw new Error('É obrigatório passar marca e modelo do item')
            const [marca] = await this.marcaRep.findOrCreate({
                where: { nome: payload.modelo!.marca!.nome! },
                defaults: { nome: payload.modelo!.marca!.nome!, ativo: true },
                transaction
            });

            const [modelo] = await this.modeloRep.findOrCreate({
                where: { nome: payload.modelo!.nome },
                defaults: { nome: payload.modelo!.nome, ativo: true, marca_id: marca.id },
                transaction
            });

            const item = await this.itemRep.create({
                numero: payload.numero!,
                classificacao: payload.classificacao,
                quantidade: payload.quantidade,
                descricao: payload.descricao,
                observacao: payload.observacao,
                valor_final: payload.valor_final,
                valor_inicial: payload.valor_inicial,
                valor_referencia: payload.valor_referencia,
                valor_minimo: payload.valor_minimo,
                valor_intervalo: payload.valor_intervalo,             
                grupo_item_id: grupoItem.id,
                modelo_id: modelo.id,
            },{ transaction });

            await transaction.commit();
            
            return item;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    }

    async findTaskByProject(participacao_id: number): Promise<Tarefa[]> {
        return await this.tarefaRep.findAll({
            where: { participacao_id },
            include: [
                {
                    model: Usuario,
                    attributes: ['nome'],
                },
                {
                    model: TarefaTipo,
                    attributes: ['nome'],
                },
                {
                    model: TarefaMovimentacao,
                    attributes: ['status_id'],
                    order: [['id', 'DESC']],
                    limit: 1,
                    include: [
                        {
                            model: TarefaStatus,
                            attributes: ['nome', 'cor'],
                        }
                    ],
                }
            ]
        });
    }

    async findItensConcorrentes(item_id: number): Promise<ParticipacaoItemConcorrente[]> {
        return await this.itemConcorrenteRep.findAll({
            include: [
                'concorrente',
                {
                    association: 'modelo',
                    include: ['marca']
                },
                {
                    association: 'grupo_item',
                    include: [
                        {
                            association: 'itens',
                            where: { id: item_id },
                            required: true
                        }
                    ]
                }
            ]
        });
    }

    async update(id: number, payload: ParticipacaoItemUpdateAttributes, usuario: UsuarioAttributes): Promise<[number]> {
        const transaction: Transaction = await Atlas.transaction();
        try {
            const { grupo_item, modelo, ...item } = payload;

            if(grupo_item) {
                const item = await this.itemRep.findById(id, { transaction })
                const grupo_item_model = await this.grupoItemRep.findById(item.grupo_item_id, {
                    include: [
                        'itens', 
                        {
                            association: 'movimentacoes',
                            where: { data_fim: null },
                            order: [['id', 'DESC']],
                            limit: 1
                        }
                    ],
                    transaction
                })

                if(grupo_item.classificacao) {
                    grupo_item_model.classificacao = grupo_item.classificacao;
                    await grupo_item_model.save({ transaction })
                }
                if(grupo_item.movimentacoes && grupo_item.movimentacoes[0].status_id != grupo_item_model.movimentacoes[0].status_id) {
                    const payload_movimentacao: ParticipacaoItemMovimentacaoCreationAttributes = {
                        data_inicio: new Date(),
                        grupo_item_id: grupo_item_model.id,
                        status_id: grupo_item.movimentacoes[0].status_id,
                        usuario_id: usuario?.id ?? 1,
                    }
                    await this.itemMovimentacaoRep.create(payload_movimentacao, { transaction })
                }

            }

            if(modelo?.nome && modelo?.marca?.nome) {
                const [marca_model] = await this.marcaRep.findOrCreate({
                    where: { nome: modelo!.marca!.nome! },
                    defaults: { nome: modelo!.marca!.nome!, ativo: true },
                    transaction
                });

                const [modelo_model] = await this.modeloRep.findOrCreate({
                    where: { nome: payload.modelo!.nome },
                    defaults: { nome: payload.modelo!.nome, ativo: true, marca_id: marca_model.id },
                    transaction
                });

                item.modelo_id = modelo_model.id;
            };
            const updated = await this.itemRep.update(item, {
                where: { id },
                transaction
             });
            await transaction.commit()
            return updated
        } catch (error) {
            await transaction.rollback()

            throw new Error(error);
        }
    }

    async toggle(id: number): Promise<[number]> {
        return await this.itemRep.toggle(id)
    }
}

export default new ItemService();