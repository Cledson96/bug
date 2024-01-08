import { RegraTipoCreationAttributes, RegraTipoUpdateAttributes } from "atlasdb:types";
import { RegraTipo } from "atlasdb:models";
import { RegraTipoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class RegraTipoService {
    private regraTipoRep: RegraTipoRepository;
    constructor() {
        this.regraTipoRep = new RegraTipoRepository();
    }

    async find(): Promise<RegraTipo[]> {
        return await this.regraTipoRep.findAll()
    }

    async findOne(options: FindOptions): Promise<RegraTipo | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.regraTipoRep.findOne(options)
    }
    
    async create(payload: RegraTipoCreationAttributes): Promise<RegraTipo> {
        return await this.regraTipoRep.create(payload)
    }

    async update(id: number, payload: RegraTipoUpdateAttributes): Promise<[number]> {
        return await this.regraTipoRep.updateById(id, payload)
    }

    async toggle(id: number): Promise<[number]> {
        return await this.regraTipoRep.toggle(id)
    }
}

export default new RegraTipoService();