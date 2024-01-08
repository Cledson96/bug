import { ParticipacaoGrupoItemCreationAttributes, ParticipacaoGrupoItemUpdateAttributes } from "atlasdb:types";
import { ParticipacaoGrupoItem, ParticipacaoItem, ParticipacaoItemConcorrente } from "atlasdb:models";
import { ParticipacaoGrupoItemRepository, ParticipacaoItemRepository, MarcaRepository, ModeloRepository, ParticipacaoItemConcorrenteRepository } from "atlasdb:repositories";
import { FindOptions, Op } from "sequelize";

class GrupoItemService {
    private grupoItemRep: ParticipacaoGrupoItemRepository;
    private itemConcorrenteRep: ParticipacaoItemConcorrenteRepository;
    private itemRep: ParticipacaoItemRepository;
    private marcaRep: MarcaRepository;
    private modeloRep: ModeloRepository;
    constructor() {
        this.grupoItemRep = new ParticipacaoGrupoItemRepository();
        this.itemConcorrenteRep = new ParticipacaoItemConcorrenteRepository();
        this.itemRep = new ParticipacaoItemRepository();
        this.marcaRep = new MarcaRepository();
        this.modeloRep = new ModeloRepository();
    }

    async find(options?: FindOptions): Promise<ParticipacaoGrupoItem[]> {
        return await this.grupoItemRep.findAll(options);
    }

    async findOne(options: FindOptions): Promise<ParticipacaoGrupoItem | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.grupoItemRep.findOne(options);
    }

    async findItensConcorrentes(grupo_item_id: number): Promise<ParticipacaoItemConcorrente[]> {
        return await this.itemConcorrenteRep.findAll({
            where: { grupo_item_id },
            include: [
                'concorrente',
                {
                    association: 'modelo',
                    include: ['marca']
                }
            ]
        });
    }

    async create(participacao_id: number, payload: ParticipacaoGrupoItemCreationAttributes): Promise<ParticipacaoGrupoItem> {
        
        const [grupoItem] = await this.grupoItemRep.findOrCreate({
            where: { 
                [Op.and]: [{ numero: payload.numero }, { participacao_id }]
            },
            defaults: payload
        });

        return grupoItem;

    }

    async update(id: number, payload: ParticipacaoGrupoItemUpdateAttributes): Promise<[number]> {
        return await this.grupoItemRep.updateById(id, payload);
    }
}

export default new GrupoItemService();