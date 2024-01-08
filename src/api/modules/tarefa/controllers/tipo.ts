import { Request, Response, NextFunction} from 'express'
import { IController } from '@api/interfaces/controller'
import { TarefaTipoService } from '@module/tarefa/services'
import { TarefaTipoAttributes, TarefaTipoUpdateAttributes, TarefaTipoCreationAttributes } from 'atlasdb:types'

class TarefaTipoController implements IController{
    //crie as funcoes necessarias aqui

    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const tarefaTipo = await TarefaTipoService.find();

            res.status(200).json({
                success: true,
                message: 'Tipos de tarefa retornados com sucesso',
                data: tarefaTipo
            });
        } catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const where = {

            }
            const tarefaTipo = await TarefaTipoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Tipos de tarefa retornados com sucesso',
                data: tarefaTipo
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const payload: TarefaTipoCreationAttributes = {
                nome: req.body.nome,
                cor: req.body.cor,
                automatico: req.body.automatico,
                principal: req.body.principal,
                ativo: req.body.ativo,
                grupo_id: req.body.grupo_id
            };


            const tarefaTipo = await TarefaTipoService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Tipo de tarefa criado com sucesso',
                data: tarefaTipo
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = Number(req.params.id);
            const payload: TarefaTipoUpdateAttributes = {
                nome: req.body.nome,
                cor: req.body.cor,
                automatico: req.body.automatico,
                principal: req.body.principal,
                ativo: req.body.ativo,
                grupo_id: req.body.grupo_id
            };

            const tarefaTipo = await TarefaTipoService.update(id, payload);

            res.status(200).json({
                success: true,
                message: 'Tipos de tarefa atualizado com sucesso',
                data: tarefaTipo
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new TarefaTipoController();