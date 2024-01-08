import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { TarefaMovimentacaoService } from "@module/tarefa/services";
import { TarefaMovimentacaoAttributes, TarefaMovimentacaoUpdateAttributes } from "atlasdb:types";

class TarefaMovimentacaoController implements IController{
    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const data = await TarefaMovimentacaoService.find();

            res.status(200).json({
                success: true,
                message: 'Movimentações de tarefa retornados com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }

    async findMov(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const data = await TarefaMovimentacaoService.findMov(req.body.user, req.body.date_start, req.body.date_end);

            res.status(200).json({
                success: true,
                message: 'Movimentações de tarefa retornados com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const where = {

            }
            const tarefaMovimentacao = await TarefaMovimentacaoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Movimentações de tarefa retornados com sucesso',
                data: tarefaMovimentacao
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const payload: TarefaMovimentacaoAttributes = {
                justificativa: "Teste",
                complemento: "teste",
                data_inicio: new Date(),
                data_fim: new Date(),
                status_id: 1,
                tarefa_id: 1,
                usuario_id: 1
            };

            const tarefaMovimentacao = await TarefaMovimentacaoService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Movimentações de tarefa criado com sucesso',
                data: tarefaMovimentacao
            });
        } catch (error) {
            
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void>{    
        try {
            const tarefaMovimentacaoId = Number(req.params.id);
            const payload: TarefaMovimentacaoUpdateAttributes = {
                justificativa: req.body.justificativa,
                complemento: "teste",
                data_inicio: new Date(),
                data_fim: new Date(),
                status_id: req.body.status_id,
                usuario_id: req.body.usuario_id,
            };

            const tarefaMovimentacao = await TarefaMovimentacaoService.update(tarefaMovimentacaoId, payload);

            res.status(200).json({
                success: true,
                message: 'Movimentações de tarefa atualizado com sucesso',
                data: tarefaMovimentacao
            });
        } catch (error) {
            
        }
    }
}

export default new TarefaMovimentacaoController();