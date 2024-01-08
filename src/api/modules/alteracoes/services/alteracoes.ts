import { Alteracoes } from 'atlas-orm/build/schemas/models'
import { AlteracoesRepository } from 'atlasdb:repositories'
import { AlteracoesAttributes } from 'atlasdb:types'
import { Op } from 'sequelize'

class AlteracoesServices {

    private alteracoesRep: AlteracoesRepository

    constructor(){
        this.alteracoesRep = new AlteracoesRepository()
    }

    async find(): Promise<Alteracoes[]>{
        return await this.alteracoesRep.findAll({
            include: [
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                },
            ]
        })
    }

    async filterTable(usuario_id: any, date_start: Date, date_end: Date): Promise<Alteracoes[] | Alteracoes >{
        const where: any = {
            created_at: {
                [Op.gte]: date_start + ' 00:00:00',
                [Op.lte]: date_end + ' 23:59:59.999999'
            }
        }

        if(usuario_id !== null && usuario_id.length > 0){
            where.usuario_id = usuario_id
        }

        return this.alteracoesRep.findAll({
            where,
            include:[
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                }
            ],
        })
        
    }

    async findOne(id: number): Promise<Alteracoes>{
        return await this.alteracoesRep.findById(id)
    }

    async create(data: AlteracoesAttributes): Promise<Alteracoes | null>{
        return await this.alteracoesRep.create(data)
    }

    async update(id: number, payload: AlteracoesAttributes): Promise<Alteracoes>{
        return await this.alteracoesRep.updateById(id, payload)
    }

}

export default new AlteracoesServices()