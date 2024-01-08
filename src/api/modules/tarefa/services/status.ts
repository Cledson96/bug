import { TarefaStatus } from "atlasdb:models";
import { TarefaStatusCreationAttributes, TarefaStatusUpdateAttributes } from "atlasdb:types";
import { TarefaStatusRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";

class TarefaStatusService{
    private tarefaStatusRep: TarefaStatusRepository;

    constructor(){
        this.tarefaStatusRep = new TarefaStatusRepository();
    }

    async find(): Promise<TarefaStatus[]>{
        return await this.tarefaStatusRep.findAll();
    }

    async findOne(options: FindOptions): Promise<TarefaStatus | null>{
        if(!options.where) throw new Error('Where is required!');
        return await this.tarefaStatusRep.findOne(options);
    }

    async create(payload: TarefaStatusCreationAttributes | TarefaStatusCreationAttributes[]): Promise<TarefaStatus | TarefaStatus[]>{
        if(Array.isArray(payload)) return await this.tarefaStatusRep.bulkCreate(payload);
        return await this.tarefaStatusRep.create(payload);
    }

    async update(id: number, payload: TarefaStatusUpdateAttributes): Promise<[number]>{
        return await this.tarefaStatusRep.updateById(id, payload);
    }
}

export default new TarefaStatusService();