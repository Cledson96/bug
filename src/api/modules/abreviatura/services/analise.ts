import {AnaliseCreationAttributes,AnaliseUpdateAttributes } from "atlasdb:types";
import {Analise } from "atlasdb:models";
import {AnaliseRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class AnaliseService {
    private AnaliseRep:AnaliseRepository;
    constructor() {
        this.AnaliseRep = new AnaliseRepository();
    }

    async find(): Promise<Analise[]> {
        return await this.AnaliseRep.findAll({
            where: { ativo: true },
            order: [['nome', 'ASC']],
        })
    }

    async findOne(options: FindOptions): Promise<Analise | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.AnaliseRep.findOne(options)
    }

    async create(payload:AnaliseCreationAttributes): Promise<Analise> {
        return await this.AnaliseRep.create(payload)
    }
    
    async update(id: number, payload:AnaliseUpdateAttributes): Promise<[number]> {
        return await this.AnaliseRep.updateById(id, payload)
    }

    async toggle(id: number): Promise<[number]> {
        return await this.AnaliseRep.toggle(id)
    }
}

export default new AnaliseService();