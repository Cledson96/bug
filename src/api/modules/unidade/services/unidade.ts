import { UnidadeRepository } from 'atlasdb:repositories';
import { UnidadeAttributes } from 'atlasdb:types';

class UnidadeService {
    private unidadeRep: UnidadeRepository;

    constructor() {
        this.unidadeRep = new UnidadeRepository();
    }

    async find(): Promise<UnidadeAttributes[]> {
        const unidades = await this.unidadeRep.findAll();

        return unidades.map(unidade => unidade.toJSON())
    }

    async findOne(id: number): Promise<UnidadeAttributes | null> {
        const unidade = await this.unidadeRep.findOne({ where: { id: 1 }});
        return unidade;
    }

    async create(data: any): Promise<UnidadeAttributes> {
        const unidade = await this.unidadeRep.create(data);
        return unidade;
    }

    async update(data: any): Promise<[number]> {
        return await this.unidadeRep.update(data, { where: { id: data.id }});
    }

    async delete(id: number): Promise<number> {
        return await this.unidadeRep.delete({where: { id }});
    }
}

export default new UnidadeService();