import { Request, Response, NextFunction } from 'express';
import { IController } from '@api/interfaces';
import { MunicipioService } from '@module/unidade/services';

class MunicipioController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const municipios = await MunicipioService.find({
                order: [['uf', 'ASC']]
            });

            res.status(200).json({
                success: true,
                data: municipios
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const municipio = await MunicipioService.findOne(res.locals.id);

            res.status(200).json({
                success: true,
                data: municipio
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const municipio = await MunicipioService.create(req.body);

            res.status(201).json({
                success: true,
                data: municipio,
                message: 'Municipio criado com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const municipio = await MunicipioService.update(req.body);

            res.status(200).json({
                success: true,
                data: municipio,
                message: 'Municipio atualizado com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

}

export default new MunicipioController();
