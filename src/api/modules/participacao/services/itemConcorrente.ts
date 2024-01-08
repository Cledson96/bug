import { MarcaRepository, ModeloRepository, ParticipacaoItemConcorrenteRepository, ConcorrenteRepository } from "atlasdb:repositories";
import { ParticipacaoItemConcorrenteCreationAttributes, ParticipacaoItemUpdateAttributes, UsuarioAttributes } from "atlasdb:types";
import { ParticipacaoItemConcorrente } from "atlasdb:models";
import { FindOptions } from "sequelize";
import { Transaction } from "sequelize";
import { Atlas } from "@atlas";

class ItemConcorrenteService {
    private itemConcorrenteRep: ParticipacaoItemConcorrenteRepository;
    private marcaRep: MarcaRepository;
    private modeloRep: ModeloRepository;
    private concorrenteRep: ConcorrenteRepository;
    
    constructor() {
        this.itemConcorrenteRep = new ParticipacaoItemConcorrenteRepository();
        this.marcaRep = new MarcaRepository();
        this.modeloRep = new ModeloRepository();
        this.concorrenteRep = new ConcorrenteRepository();
    }

    async find(options?: FindOptions): Promise<ParticipacaoItemConcorrente[]> {
        return await this.itemConcorrenteRep.findAll(options);
    }

    async findOne(options?: FindOptions): Promise<ParticipacaoItemConcorrente> {
        if(!options?.where) throw new Error('Where is required')
        return await this.itemConcorrenteRep.findOne(options);
    }

    async create(payload: ParticipacaoItemConcorrenteCreationAttributes, usuario: UsuarioAttributes): Promise<ParticipacaoItemConcorrente | undefined>  {
        const transaction: Transaction = await Atlas.transaction();
        try {
            const { concorrente, modelo, ...item }  = payload;

            if(!modelo && !modelo!.marca ) throw new Error('É obrigatório passar marca e modelo do item')

            const [marca_model] = await this.marcaRep.findOrCreate({
                where: { nome: modelo!.marca!.nome! },
                defaults: { nome: modelo!.marca!.nome!, ativo: true },
                transaction
            });

            const [modelo_model] = await this.modeloRep.findOrCreate({
                where: { nome: modelo!.nome },
                defaults: { nome: modelo!.nome, ativo: true, marca_id: marca_model.id },
                transaction
            });

            if(!concorrente) throw new Error('É obrigatório passar o concorrente para este respectivo item')
            concorrente.cnpj = concorrente.cnpj.replace(/\.|-|\//gm, '')
            const [concorrente_model] = await this.concorrenteRep.findOrCreate({
                where: { cnpj: concorrente.cnpj, nome: concorrente.nome },
                defaults: concorrente,
                transaction
            });


            if(!item.grupo_item_id) throw new Error('É obrigatorior passar o grupo correspondente a este item')
            const itemConcorrente = await this.itemConcorrenteRep.create({
                concorrente_id: concorrente_model.id,
                modelo_id: modelo_model.id,
                grupo_item_id: item.grupo_item_id,
                quantidade: item.quantidade,
                classificacao: item.classificacao,
                valor_final: parseFloat(item.valor_final.toString()),
                observacao: item.observacao,
            }, { transaction })

            await transaction.commit();

            return itemConcorrente;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    }

    
    async update(id: number, payload: ParticipacaoItemUpdateAttributes): Promise<[number]> {
        return await this.itemConcorrenteRep.updateById(id, payload);
    }

}

export default new ItemConcorrenteService();