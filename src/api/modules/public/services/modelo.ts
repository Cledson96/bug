import { Modelo } from "atlasdb:models";
import { ModeloAttributes, ModeloUpdateAttributes } from "atlasdb:types";
import { ModeloRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class ModeloService {
    private modeloRep: ModeloRepository;

    constructor() { 
        this.modeloRep = new ModeloRepository();
    }

    async find(options?: FindOptions): Promise<Modelo[]> {
        return await this.modeloRep.findAll(options);
    }

    async findOne(options: FindOptions): Promise<Modelo | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.modeloRep.findOne(options)
    }

    async create(payload: ModeloAttributes | ModeloAttributes[]): Promise<Modelo | Modelo[]> {
        if(Array.isArray(payload)) return await this.modeloRep.bulkCreate(payload);
        return await this.modeloRep.create(payload);
    }

    async update(id: number, payload: ModeloUpdateAttributes): Promise<[number]> {
        return await this.modeloRep.updateById(id, payload);
    }

}

export default new ModeloService();