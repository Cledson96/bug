import { Request, Response, NextFunction } from 'express';
import { IController } from '@api/interfaces';
import { UnidadeService } from '@module/unidade/services';

class UnidadeController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const unidades = await UnidadeService.find();

            res.status(200).json({
                success: true,
                data: unidades
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const unidade = await UnidadeService.findOne(res.locals.id);

            res.status(200).json({
                success: true,
                data: unidade
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const unidade = await UnidadeService.create(req.body);

            res.status(201).json({
                success: true,
                data: unidade,
                message: 'Unidade criada com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const unidade = await UnidadeService.update(req.body);

            res.status(200).json({
                success: true,
                data: unidade,
                message: 'Unidade atualizado com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

}

export default new UnidadeController();
