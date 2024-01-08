import { TarefaGrupo, TarefaTipo } from "atlasdb:models";
import { TarefaGrupoCreationAttributes, TarefaGrupoAttributes, TarefaGrupoUpdateAttributes } from "atlasdb:types";
import { TarefaGrupoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class TarefaGrupoService {
    private tarefaGrupoRep: TarefaGrupoRepository;

    constructor() {
        this.tarefaGrupoRep = new TarefaGrupoRepository();
    }

    async find(): Promise<TarefaGrupo[]> {
        return await this.tarefaGrupoRep.findAll({
            include: [
                {
                    model: TarefaTipo,
                    attributes: ['id', 'nome', 'cor', 'automatico', 'principal', 'ativo', 'grupo_id'],
                }
            ],
        });
    }

    async findOne(options: FindOptions): Promise<TarefaGrupo | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.tarefaGrupoRep.findOne(options)
    }

    async create(payload: TarefaGrupoCreationAttributes | TarefaGrupoCreationAttributes[]): Promise<TarefaGrupo | TarefaGrupo[]> {
        if (Array.isArray(payload)) return await this.tarefaGrupoRep.bulkCreate(payload);
        return await this.tarefaGrupoRep.create(payload);
    }

    async update(id: number, payload: TarefaGrupoUpdateAttributes): Promise<[number]> {
        return await this.tarefaGrupoRep.updateById(id, payload);
    }

}

export default new TarefaGrupoService();