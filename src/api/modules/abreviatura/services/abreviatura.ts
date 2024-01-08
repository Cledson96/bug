import {AbreviaturaAttributes, AbreviaturaCreationAttributes,AbreviaturaUpdateAttributes } from "atlasdb:types";
import {Abreviatura } from "atlasdb:models";
import {AbreviaturaRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";
import { Gets, OrgaoData } from "abreviaturas/build";

class AbreviaturaService {
    private AbreviaturaRep:AbreviaturaRepository;
    constructor() {
        this.AbreviaturaRep = new AbreviaturaRepository();
    }

    async find(): Promise<Abreviatura[]> {
        return await this.AbreviaturaRep.findAll({
            order: [['sigla', 'ASC']]
        })
    }

    async findOne(options: FindOptions<AbreviaturaAttributes>): Promise<Abreviatura | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.AbreviaturaRep.findOne(options)
    }

    async create(payload:AbreviaturaCreationAttributes): Promise<Abreviatura> {
        return await this.AbreviaturaRep.create(payload)
    }
    
    async update(id: number, payload:AbreviaturaUpdateAttributes): Promise<[number]> {
        return await this.AbreviaturaRep.updateById(id, payload)
    }

    async toggle(id: number): Promise<[number]> {
        return await this.AbreviaturaRep.toggle(id)
    }

    async singleAbbreviation(payload: OrgaoData): Promise<string> {
        const abreviaturas = await this.AbreviaturaRep.findAll();

        const { success, projeto } = await Gets.getNomeAbreviado(payload, abreviaturas)
        if(!success || !projeto) throw new Error('Não foi possível abreviar o nome');

        return projeto;
    }

    async multiAbbreviation(payload: OrgaoData[]): Promise<string[]> {
        const abreviaturas = await this.AbreviaturaRep.findAll();
        const projetos: string[] = [];
        for (const orgao of payload) {
            const { success, projeto } = await Gets.getNomeAbreviado(orgao, abreviaturas)
            if(!success || !projeto) throw new Error('Não foi possível abreviar o nome');
            projetos.push(projeto);
        }
        return projetos;
    }
}

export default new AbreviaturaService();