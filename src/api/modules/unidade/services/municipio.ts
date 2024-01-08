import { MunicipioRepository } from 'atlasdb:repositories';
import { MunicipioAttributes } from 'atlasdb:types';
import { FindOptions } from "sequelize";

class MunicipioService {
    private municipioRep: MunicipioRepository;

    constructor() {
        this.municipioRep = new MunicipioRepository();
    }

    async find(options?: FindOptions): Promise<MunicipioAttributes[]> {
        const municipios = await this.municipioRep.findAll(options);

        return municipios.map(municipio => municipio.toJSON())
    }

    async findOne(options: FindOptions): Promise<MunicipioAttributes | null> {
        if(!options.where) throw new Error('Where is required');
        return await this.municipioRep.findOne(options);
    }

    async create(data: any): Promise<MunicipioAttributes> {
        
        const municipio = await this.municipioRep.create(data);
        return municipio
    }

    async update(data: any): Promise<[number]> {
        return await this.municipioRep.update(data, { where: { id: data.id }});
    }

    async delete(id: number): Promise<number> {
        return await this.municipioRep.delete({where: { id }});
    }
}

export default new MunicipioService();