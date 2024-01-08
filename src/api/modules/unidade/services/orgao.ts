import { OrgaoRepository } from 'atlasdb:repositories';
import Orgao from 'atlasdb:models';
import { OrgaoAttributes } from 'atlasdb:types';

class OrgaoService {
    private orgaoRep: OrgaoRepository;

    constructor() {
        this.orgaoRep = new OrgaoRepository();
    }

    async find(): Promise<OrgaoAttributes[]> {
        const orgaos = await this.orgaoRep.findAll();

        return orgaos.map(orgao => orgao.toJSON())
    }

    async findOne(id: number): Promise<OrgaoAttributes | null> {
        const orgao = await this.orgaoRep.findOne({ where: { id: 1 }})
        return orgao;
    }

    async create(data: any): Promise<OrgaoAttributes> {
        const orgao = await this.orgaoRep.create(data);
        return orgao;
    }

    async update(data: any): Promise<[number]> {
        return await this.orgaoRep.update(data, { where: { id: data.id }});
    }

    async delete(id: number): Promise<number> {
        return await this.orgaoRep.delete({where: { id }});
    }
}

export default new OrgaoService();