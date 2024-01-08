import { AvisoItemCreationAttributes, AvisoItemUpdateAttributes } from "atlasdb:types";
import { AvisoItem } from "atlasdb:models";
import { AvisoItemRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class AvisoItemService {
    private avisoItemRep: AvisoItemRepository;
    constructor() {
        this.avisoItemRep = new AvisoItemRepository();
    }

    async find(): Promise<AvisoItem[]> {
        return await this.avisoItemRep.findAll();
    }

    async findOne(options: FindOptions): Promise<AvisoItem | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.avisoItemRep.findOne(options);
    }

    async create(payload: AvisoItemCreationAttributes | AvisoItemCreationAttributes[]): Promise<AvisoItem | AvisoItem[]> {
        if(Array.isArray(payload)) return await this.avisoItemRep.bulkCreate(payload);
        return await this.avisoItemRep.create(payload);
    }

    async update(id: number, payload: AvisoItemUpdateAttributes): Promise<[number]> {
        return await this.avisoItemRep.updateById(id, payload);
    }
}

export default new AvisoItemService();