import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { TarefaGrupoService } from "@module/tarefa/services";
import { TarefaGrupoCreationAttributes, TarefaGrupoUpdateAttributes } from "atlasdb:types";

class TarefaGrupoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const tarefaGrupo = await TarefaGrupoService.find();

            res.status(200).json({
                success: true,
                message: 'Grupos de tarefa retornados com sucesso',
                data: tarefaGrupo
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const where = {}
            const tarefaGrupo = await TarefaGrupoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Grupo de tarefa retornados com sucesso',
                data: tarefaGrupo
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const payload: TarefaGrupoCreationAttributes = {
                nome: req.body.nome,
                ativo: req.body.ativo,
                cor: req.body.cor
            };

            const tarefaGrupo = await TarefaGrupoService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Grupo de tarefa criado com sucesso',
                data: tarefaGrupo
            });
        } catch (error) {
            console.log(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void>{    
        try {
            const tarefaGrupoId = Number(req.params.id);
            const payload: TarefaGrupoUpdateAttributes = {
                nome: req.body.nome,
                ativo: req.body.ativo,
                cor: req.body.cor,
            };
            
            const tarefaGrupo = await TarefaGrupoService.update(tarefaGrupoId, payload);

            res.status(200).json({
                success: true,
                message: 'Grupos de tarefa atualizado com sucesso',
                data: tarefaGrupo
            });

        } catch (error) {
            next(error);
            console.log(error);
        }
    }
}

export default new TarefaGrupoController();
