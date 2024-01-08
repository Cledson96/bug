import { AvisoTipo } from "atlasdb:models";
import { AvisoTipoCreationAttributes, AvisoTipoUpdateAttributes } from "atlasdb:types";
import { AvisoTipoRepository } from "atlasdb:repositories";

class AvisoTipoService {
    private avisoTipoRep: AvisoTipoRepository;
    constructor() {
        this.avisoTipoRep = new AvisoTipoRepository();
    }

    async find(): Promise<AvisoTipo[]> {
        return await this.avisoTipoRep.findAll()
    }

    async findOne(where: {}): Promise<AvisoTipo | null> {
        return await this.avisoTipoRep.findOne({where})
    }

    async create(payload: AvisoTipoCreationAttributes): Promise<AvisoTipo> {
        return await this.avisoTipoRep.create(payload)
    }

    async update(id: number, payload: AvisoTipoUpdateAttributes): Promise<[number]> {
        return await this.avisoTipoRep.updateById(id, payload)
    }
}

export default new AvisoTipoService();