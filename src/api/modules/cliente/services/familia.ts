import { Atlas } from '@atlas';
import { Familia } from 'atlas-orm/build/schemas/models';
import { FamiliaRepository, RegraRepository, TagRepository } from 'atlasdb:repositories';
import { FamiliaAttributes, FamiliaCreationAttributes, FamiliaUpdateAttributes } from 'atlasdb:types';
import Socket from '@service/socket/index'
import { FindOptions, Op, Transaction } from "sequelize";

class FamiliaService<T> {
    private familiaRep: FamiliaRepository;
    private tagRep: TagRepository;
    private regraRep: RegraRepository;

    constructor() {
        this.familiaRep = new FamiliaRepository();
        this.tagRep = new TagRepository();
        this.regraRep = new RegraRepository();
    }

    async find(options?: FindOptions): Promise<FamiliaAttributes[]> {
        const familias = await this.familiaRep.findAll(options);

        return familias.map(familia => familia.toJSON())
    }

    async findOne(id: number): Promise<FamiliaAttributes | null> {
        const familia = await this.familiaRep.findOne({ where: { id: id }})
        return familia;
    }

    async findByGroupClient(id: number): Promise<FamiliaAttributes[] | FamiliaAttributes | null>{
        const familiaByGroup = await this.familiaRep.findOne({where: {cliente_grupo_id: id}})
        return familiaByGroup
    }

    async create(data: FamiliaCreationAttributes): Promise<void> {
        const transaction: Transaction = await Atlas.transaction();

        try {
            if (!data.nome || data.nome.trim().length == 0) throw new Error('Nome é obrigatório');
            if (!data.cliente_grupo_id) throw new Error('Grupo de cliente é obrigatório');
    
            const familiaExists = await this.familiaRep.findOne({ where : {
                [Op.and]: [{ nome: data.nome }, { cliente_grupo_id: data.cliente_grupo_id }]
            }});
            if (familiaExists) throw new Error('Familia já existe');
    
            const familia = await this.familiaRep.create(data, { transaction });

            Socket.emitSocketEvent('notificacao', 'notificacao_enviada', familia, 'alo' )

            // // ? TAGS
            // if (data.tags) {
            //     const duplicates =  data.tags.filter((item, index) => data.tags!.findIndex(i => i.nome === item.nome) !== index);
            //     if(duplicates.length > 0) throw new Error(`As tags ${duplicates.map(d => d.nome).join(', ')} estão duplicadas`);

            //     for (let tag of data.tags) {
            //         const tagPayload = {
            //             nome: tag.nome.toLowerCase(),
            //             familia_id: familia.id!,
            //             ativo: tag.ativo ?? true
            //         }
            //         await this.tagRep.create(tagPayload, { transaction });
            //     }
            // }

            // if (data.regras) {

            //     const duplicates =  data.regras.filter((item, index) => data.regras!.findIndex(i => 
            //         i.campo === item.campo && 
            //         i.valor === item.valor && 
            //         i.tipo_id === item.tipo_id
            //     ) !== index);
            //     if(duplicates.length > 0) throw new Error(`As regras ${duplicates.map(d => d.campo).join(', ')} estão duplicadas`);

            //     for (let regra of data.regras) {
            //         const regraPayload = {
            //             campo: regra.campo,
            //             valor: regra.valor,
            //             familia_id: familia.id!,
            //             tipo_id: regra.tipo_id,
            //             ativo: regra.ativo ?? true
            //         }
            //         await this.regraRep.create(regraPayload, { transaction });
            //     }
            // }

            transaction.commit();
        }
        catch (err) {
            transaction.rollback();
            throw err;
        }
    }

    async update(id: number, data: FamiliaUpdateAttributes): Promise<void> {
        const transaction: Transaction = await Atlas.transaction();

        try {
            if(!id) throw new Error('ID é obrigatório');
            if(!data.nome || data.nome.trim().length == 0) throw new Error('Nome é obrigatório');

            await this.familiaRep.update(data, { where: { id }, transaction });

            
            // // ? TAGS
            // if (data.tags) {
            //     const duplicates =  data.tags.filter((item, index) => data.tags!.findIndex(i => i.nome === item.nome) !== index);
            //     if(duplicates.length > 0) throw new Error(`As tags ${duplicates.map(d => d.nome).join(', ')} estão duplicadas`);

            //     for (let tag of data.tags) {

            //         if (!tag.id) {
            //             const tagPayload = {
            //                 nome: tag.nome.toLowerCase(),
            //                 familia_id: tag.familia_id,
            //                 ativo: tag.ativo ?? true
            //             }
            //             await this.tagRep.create(tagPayload);
            //         }
                    
            //         else {
            //             const tagPayload = {
            //                 nome: tag.nome.toLowerCase(),
            //                 ativo: tag.ativo ?? true
            //             }
            //             await this.tagRep.update(tagPayload, { where: { id: tag.id } });
            //         }
            //     }
            // }

            
            // // ? REGRAS
            // if (data.regras) {
            //     const duplicates =  data.regras.filter((item, index) => data.regras!.findIndex(i => 
            //         i.campo === item.campo && 
            //         i.valor === item.valor && 
            //         i.tipo_id === item.tipo_id
            //     ) !== index);
            //     if(duplicates.length > 0) throw new Error(`As regras ${duplicates.map(d => d.campo).join(', ')} estão duplicadas`);

            //     for (let regra of data.regras) {

            //         if (!regra.id) {
            //             const regraPayload = {
            //                 campo: regra.campo,
            //                 valor: regra.valor,
            //                 familia_id: regra.familia_id,
            //                 tipo_id: regra.tipo_id,
            //                 ativo: regra.ativo ?? true
            //             }
            //             await this.regraRep.create(regraPayload);
            //         }
                    
            //         else {
            //             const regraPayload = {
            //                 campo: regra.campo,
            //                 valor: regra.valor,
            //                 tipo_id: regra.tipo_id,
            //                 ativo: regra.ativo ?? true
            //             }
            //             await this.regraRep.update(regraPayload, { where: { id: regra.id } });
            //         }
            //     }
            // }

            transaction.commit();
        }
        catch(err) {
            transaction.rollback();
            throw err;
        }
    }

    async toggle(id: number): Promise<[number]> {
        return await this.familiaRep.toggle(id)
    }

}

export default new FamiliaService();