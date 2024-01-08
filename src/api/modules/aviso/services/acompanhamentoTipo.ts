import { AvisoAcompanhamentoTipoCreationAttributes, AvisoAcompanhamentoTipoUpdateAttributes } from "atlasdb:types";
import { AvisoAcompanhamentoTipo } from "atlasdb:models";
import { AvisoAcompanhamentoTipoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class AvisoAcompanhamentoTipoService {
    private avisoAcompanhamentoTipoRep: AvisoAcompanhamentoTipoRepository;
    constructor() {
        this.avisoAcompanhamentoTipoRep = new AvisoAcompanhamentoTipoRepository();
    }

    async find(): Promise<AvisoAcompanhamentoTipo[]> {
        return await this.avisoAcompanhamentoTipoRep.findAll()
    }

    async findOne(options: FindOptions): Promise<AvisoAcompanhamentoTipo | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.avisoAcompanhamentoTipoRep.findOne(options)
    }

    async create(payload: AvisoAcompanhamentoTipoCreationAttributes): Promise<AvisoAcompanhamentoTipo> {
        return await this.avisoAcompanhamentoTipoRep.create(payload)
    }
    
    async update(id: number, payload: AvisoAcompanhamentoTipoUpdateAttributes): Promise<[number]> {
        return await this.avisoAcompanhamentoTipoRep.updateById(id, payload)
    }
}

export default new AvisoAcompanhamentoTipoService();