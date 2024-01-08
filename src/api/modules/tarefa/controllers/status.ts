import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { TarefaStatusService } from "@module/tarefa/services";
import { TarefaStatusAttributes, TarefaStatusUpdateAttributes } from "atlasdb:types";

class TarefaStatusController implements IController {

    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const tarefaStatus = await TarefaStatusService.find();

            res.status(200).json({
                success: true,
                message: 'Status de tarefa retornados com sucesso',
                data: tarefaStatus
            });
        } catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const where = {

            }
            const tarefaStatus = await TarefaStatusService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Status de tarefa retornados com sucesso',
                data: tarefaStatus
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const payload: TarefaStatusAttributes = {
                id: 1,
                nome: "Teste",
                descricao: "teste",
                ativo: true
            };

            const tarefaStatus = await TarefaStatusService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Status de tarefa criado com sucesso',
                data: tarefaStatus
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            
            const id = req.body.id;
            const payload: TarefaStatusUpdateAttributes = {
                nome: req.body.status,
            };

            const tarefaStatus = await TarefaStatusService.update(id, payload);

            res.status(200).json({
                success: true,
                message: 'Status de tarefa atualizado com sucesso',
                data: tarefaStatus
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new TarefaStatusController();