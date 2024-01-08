import { AvisoModalidade } from "atlasdb:models";
import { AvisoModalidadeCreationAttributes, AvisoModalidadeUpdateAttributes } from "atlasdb:types";
import { AvisoModalidadeRepository } from "atlasdb:repositories";

class AvisoModalidadeService {
    private avisoModalidadeRep: AvisoModalidadeRepository;
    constructor() {
        this.avisoModalidadeRep = new AvisoModalidadeRepository();
    }
    
    async find(): Promise<AvisoModalidade[]> {
        return await this.avisoModalidadeRep.findAll()
    }

    async findOne(where: {}): Promise<AvisoModalidade | null> {
        return await this.avisoModalidadeRep.findOne({where})
    }

    async create(payload: AvisoModalidadeCreationAttributes): Promise<AvisoModalidade> {
        return await this.avisoModalidadeRep.create(payload)
    }

    async update(id: number, payload: AvisoModalidadeUpdateAttributes): Promise<[number]> {
        return await this.avisoModalidadeRep.updateById(id, payload)
    }
}

export default new AvisoModalidadeService();