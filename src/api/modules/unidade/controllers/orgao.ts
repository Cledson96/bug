import { Request, Response, NextFunction } from 'express';
import { IController } from '@api/interfaces';
import { OrgaoService } from '../services';

class OrgaoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orgaos = await OrgaoService.find();

            res.status(200).json({
                success: true,
                data: orgaos
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orgao = await OrgaoService.findOne(res.locals.id);

            res.status(200).json({
                success: true,
                data: orgao
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orgao = await OrgaoService.create(req.body);

            res.status(201).json({
                success: true,
                data: orgao,
                message: 'orgao criado com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orgao = await OrgaoService.update(req.body);

            res.status(200).json({
                success: true,
                data: orgao,
                message: 'Orgao atualizado com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

}

export default new OrgaoController();
