import { Marca } from "atlasdb:models";
import { MarcaCreationAttributes, MarcaAttributes, MarcaUpdateAttributes } from "atlasdb:types";
import { MarcaRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class MarcaService {
    private marcaRep: MarcaRepository;

    constructor() {
        this.marcaRep = new MarcaRepository();
    }

    async find(options?: FindOptions): Promise<Marca[]> {
        return await this.marcaRep.findAll(options);
    }

    async findOne(options: FindOptions): Promise<Marca | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.marcaRep.findOne(options)
    }

    async create(payload: MarcaCreationAttributes | MarcaCreationAttributes[]): Promise<Marca | Marca[]> {
        if (Array.isArray(payload)) return await this.marcaRep.bulkCreate(payload);
        return await this.marcaRep.create(payload);
    }

    async update(id: number, payload: MarcaUpdateAttributes): Promise<[number]> {
        return await this.marcaRep.updateById(id, payload);
    }

}

export default new MarcaService();