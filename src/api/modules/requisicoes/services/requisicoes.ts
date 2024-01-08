import { Requisicoes } from 'atlasdb:models'
import { RequisicoesAttributes, RequisicoesCreationAttributes, RequisicoesUpdateAttributes } from 'atlasdb:types'
import { RequisicoesRepository } from 'atlasdb:repositories'
import { FindOptions } from "sequelize";
import { Op } from 'sequelize';

class RequisicoesService {
    private requisicoesRep: RequisicoesRepository
    
    constructor(){
        this.requisicoesRep = new RequisicoesRepository()
    }

    async find(): Promise<Requisicoes[]>{
        return await this.requisicoesRep.findAll({
            include: [
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                }
            ]
            ,limit: 100,
        })
    }

    async filterTable(usuario_id: any, date_start: Date, date_end: Date): Promise<Requisicoes[] | Requisicoes >{
        const where: any = {
            momento: {
                [Op.gte]: date_start + ' 00:00:00',
                [Op.lte]: date_end + ' 23:59:59.999999'
            }
        }

        if(usuario_id !== null && usuario_id.length > 0){
            where.usuario_id = usuario_id
        }

        return this.requisicoesRep.findAll({
            where,
            include:[
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                }
            ]
            ,limit: 100,
        })
        
    }

    async findOne(options: FindOptions): Promise<Requisicoes>{
        return await this.requisicoesRep.findOne(options)
    }

    async update(id: number, payload: RequisicoesUpdateAttributes): Promise<Requisicoes>{
        return await this.requisicoesRep.updateById(id, payload)
    }

    async create(payload: RequisicoesCreationAttributes | RequisicoesCreationAttributes[]): Promise<RequisicoesAttributes | RequisicoesAttributes[] | null>{
        if (Array.isArray(payload)) return await this.requisicoesRep.bulkCreate(payload);
        return await this.requisicoesRep.create(payload);
    }

}


export default new RequisicoesService()