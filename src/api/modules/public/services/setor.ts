import { Setor } from "atlasdb:models";
import { SetorCreationAttributes, SetorUpdateAttributes } from "atlasdb:types";
import { SetorRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class SetorService {
    private setorRep: SetorRepository;

    constructor() {
        this.setorRep = new SetorRepository();
    }

    async find(options?: FindOptions): Promise<Setor[]> {
        return await this.setorRep.findAll(options);
    }

    async findOne(options: FindOptions): Promise<Setor | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.setorRep.findOne(options)
    }

    async create(payload: SetorCreationAttributes | SetorCreationAttributes[]): Promise<Setor | Setor[]> {
        if (Array.isArray(payload)) return await this.setorRep.bulkCreate(payload);
        return await this.setorRep.create(payload);
    }

    async update(id: number, payload: SetorUpdateAttributes): Promise<[number]> {
        return await this.setorRep.updateById(id, payload);
    }

}

export default new SetorService();