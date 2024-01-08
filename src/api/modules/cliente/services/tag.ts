import { TagCreationAttributes, TagUpdateAttributes } from "atlasdb:types";
import { Tag } from "atlasdb:models";
import { TagRepository } from "atlasdb:repositories";
import { FindOptions, Op } from "sequelize";

class TagService {
    private tagRep: TagRepository;
    constructor() {
        this.tagRep = new TagRepository();
    }

    async find(options?: FindOptions): Promise<Tag[]> {
        return await this.tagRep.findAll(options)
    }

    async findOne(options: FindOptions): Promise<Tag | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.tagRep.findOne(options)
    }
    
    async findTagByFamily(id: number): Promise<Tag[] | Tag>{
        const tagByFamily = this.tagRep.findAll({
            where: {familia_id: id}
        })
        
        return tagByFamily
    }

    async create(payload: TagCreationAttributes): Promise<Tag> {
        if (payload.nome == undefined) throw new Error('Nome é obrigatório');
        if (payload.familia_id == undefined) throw new Error('Familia é obrigatório');

        const exists = await this.tagRep.findOne({ where : {
                [Op.and]: [{ nome: payload.nome }, { familia_id: payload.familia_id }]
            }
        });
        
        if (exists) throw new Error('Familia já existe');

        return await this.tagRep.create(payload)
    }

    async update(id: number, payload: TagUpdateAttributes): Promise<[number]> {
        return await this.tagRep.updateById(id, payload)
    }

    async toggle(id: number): Promise<[number]> {
        return await this.tagRep.toggle(id)
    }
}

export default new TagService();