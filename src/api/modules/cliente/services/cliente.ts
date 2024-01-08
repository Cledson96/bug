import { ClienteCreationAttributes, ClienteUpdateAttributes } from "atlasdb:types";
import { Cliente } from "atlasdb:models";
import { ClienteRepository } from "atlasdb:repositories";
import { FindOptions, Op } from "sequelize";

class ClienteService<T> {
    private clienteRep: ClienteRepository<T>;
    constructor() {
        this.clienteRep = new ClienteRepository();
    }

    async find(options?: FindOptions): Promise<Cliente[]> {
        return await this.clienteRep.findAll(options)
    }

    async findOne(options: FindOptions): Promise<Cliente | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.clienteRep.findOne(options)
    }
    
    async create(payload: ClienteCreationAttributes): Promise<Cliente | null> {
        if(payload.nome == undefined || payload.nome == '') throw new Error('Nome é obrigatório')
        if(payload.email == undefined || payload.email == '') throw new Error('Email é obrigatório')
        if(payload.cnpj == undefined || payload.cnpj == '') throw new Error('CNPJ é obrigatório')
        if(payload.grupo_id == undefined) throw new Error('Grupo é obrigatório')
        if(payload.municipio_id == undefined) throw new Error('Município é obrigatório')

        const exists = await this.clienteRep.findOne({ 
            where : {
                [Op.or]: [{ nome: payload.nome }, { email: payload.email }, { cnpj: payload.cnpj } ]
            }
        });

        if(exists) throw new Error('Cliente já existe')
        
        return await this.clienteRep.create(payload)
    }

    async update(id: number, payload: ClienteUpdateAttributes): Promise<Cliente> {
        return await this.clienteRep.updateById(id, payload)
    }

    async toggle(id: number): Promise<Cliente> {
        return await this.clienteRep.toggle(id)
    }
}

export default new ClienteService();