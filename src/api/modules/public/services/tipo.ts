import { Tipo } from "atlasdb:models";
import { TiposRepository } from "atlasdb:repositories";

class TipoService {
    private tipoRep: TiposRepository;

    constructor() {
        this.tipoRep = new TiposRepository();
    }

    async find(): Promise<Tipo[]> {
        return await this.tipoRep.findAll();
    }

}

export default new TipoService();