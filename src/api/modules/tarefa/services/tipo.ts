import { TarefaGrupo, TarefaTipo } from "atlasdb:models";
import { TarefaTipoAttributes, TarefaTipoCreationAttributes, TarefaTipoUpdateAttributes } from "atlasdb:types";
import { TarefaTipoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class TarefaTipoService {
    private tarefaTipoRep: TarefaTipoRepository;

    constructor() {
        this.tarefaTipoRep = new TarefaTipoRepository();
    }

    async find(): Promise<TarefaTipo[]> {
        return await this.tarefaTipoRep.findAll({
            include: [
                {
                    model: TarefaGrupo,
                    attributes: ['id', 'nome'],
                
                }
            ]
        });
    }

    async findOne(options: FindOptions): Promise<TarefaTipo | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.tarefaTipoRep.findOne(options)
    }

    async create(payload: TarefaTipoAttributes ): Promise<TarefaTipo | TarefaTipo[]> {
        if(payload.nome === undefined) throw new Error('Titulo é obrigatório');
        if(payload.cor === undefined) throw new Error('Cor é obrigatório');
        if(payload.automatico === undefined) throw new Error('Automatico é obrigatório');
        if(payload.principal === undefined) throw new Error('Principal é obrigatório');
        if(payload.ativo === undefined) throw new Error('Ativo é obrigatório');
        if(payload.grupo_id === undefined) throw new Error('Grupo é obrigatório');
        if(Array.isArray(payload)) return await this.tarefaTipoRep.bulkCreate(payload);
        return await this.tarefaTipoRep.create(payload);
    }

    async update(id: number, payload: TarefaTipoUpdateAttributes): Promise<[number]> {
        return await this.tarefaTipoRep.updateById(id, payload);
    }

}

export default new TarefaTipoService();