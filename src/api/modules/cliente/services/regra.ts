import { RegraCreationAttributes, RegraUpdateAttributes } from "atlasdb:types";
import { Regra } from "atlasdb:models";
import { RegraRepository } from "atlasdb:repositories";
import { FindOptions, Op } from "sequelize";

class RegraService {
    private regraRep: RegraRepository;
    constructor() {
        this.regraRep = new RegraRepository();
    }

    async find(options?: FindOptions): Promise<Regra[]> {
        return await this.regraRep.findAll(options)
    }

    async findOne(options: FindOptions): Promise<Regra | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.regraRep.findOne(options)
    }
    
    async create(payload: RegraCreationAttributes): Promise<Regra> {
        // if(payload.campo == undefined || payload.campo == '') throw new Error('Campo é obrigatório')
        if(payload.valor == undefined || payload.valor == null) throw new Error('Valor é obrigatório')
        if(payload.familia_id == undefined ) throw new Error('Família é obrigatório')
        if(payload.tipo_id == undefined ) throw new Error('Tipo é obrigatório')

        const exists = await this.regraRep.findOne({ 
            where: { 
                [Op.and]: [{ valor: payload.valor }, { familia_id: payload.familia_id }, { tipo_id: payload.tipo_id }]
            }
        });

        if(exists) throw new Error('Regra já existe')

        return await this.regraRep.create(payload)
    }

    async update(id: number, payload: RegraUpdateAttributes): Promise<[number]> {
        return await this.regraRep.updateById(id, payload)
    }

    async toggle(id: number): Promise<[number]> {
        return await this.regraRep.toggle(id)
    }
}

export default new RegraService();