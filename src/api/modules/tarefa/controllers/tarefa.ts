import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { TarefaService } from "@module/tarefa/services";
import { TarefaCreationAttributes, TarefaAttributes, TarefaUpdateAttributes, TarefaMovimentacaoUpdateAttributes } from "atlasdb:types";

class TarefaController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await TarefaService.find();
            
            res.status(200).json({
                success: true,
                message: 'Tarefas retornadas com sucesso',
                data
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tarefa_id = Number(req.params.id);
            const where = {
                where: { id: tarefa_id },
            }
            const tarefa = await TarefaService.findOne(where);
            

            res.status(200).json({
                success: true,
                message: 'Tarefa retornada com sucesso',
                data: tarefa
            });
        } catch (error) {
            next(error);
        }
    }

    async findTaskByProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const participacao_id = Number(req.params.id);
            const scope = req.params.scope;
            const where = {
                where: {participacao_id: participacao_id},
            }
            const tarefa = await TarefaService.findTaskByProject(where);
            

            res.status(200).json({
                success: true,
                message: 'Tarefa por Projeto retornada com sucesso',
                data: tarefa
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const payload: TarefaCreationAttributes = req.body;

            const tarefa = await TarefaService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Tarefa criada com sucesso',
                data: tarefa
            });

        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tarefa_id = Number(req.params.id);
            const payload: TarefaMovimentacaoUpdateAttributes = {
                status_id: req.body.status_id,
                justificativa: req.body.justificativa,
                usuario_id: req.body.usuario_id,
            };

            const newPrazo = req.body.data_prazo

            const tarefa = await TarefaService.update(tarefa_id, payload, newPrazo);
            
            res.status(200).json({
                success: true,
                message: 'Tarefa atualizada com sucesso',
                data: tarefa
            });
        } catch (error) {
            
        }
    }
}


export default new TarefaController();