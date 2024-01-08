import { AvisoStatusCreationAttributes, AvisoStatusUpdateAttributes } from "atlasdb:types";
import { AvisoStatus } from "atlasdb:models";
import { AvisoStatusRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class AvisoStatusService {
    private avisoStatusRep: AvisoStatusRepository;
    constructor() {
        this.avisoStatusRep = new AvisoStatusRepository()        ;
    }

    async find(): Promise<AvisoStatus[]> {
        return await this.avisoStatusRep.findAll();
    }

    async findOne(options: FindOptions): Promise<AvisoStatus | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.avisoStatusRep.findOne(options);
    }

    async create(payload: AvisoStatusCreationAttributes | AvisoStatusCreationAttributes[]): Promise<AvisoStatus | AvisoStatus[]> {
        if(Array.isArray(payload)) return await this.avisoStatusRep.bulkCreate(payload);
        return await this.avisoStatusRep.create(payload);
    }

    async update(id: number, payload: AvisoStatusUpdateAttributes): Promise<[number]> {
        return await this.avisoStatusRep.updateById(id, payload);
    }
}

export default new AvisoStatusService();