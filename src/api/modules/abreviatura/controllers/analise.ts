import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AnaliseService } from "@module/abreviatura/services";
import { AnaliseCreationAttributes, AnaliseUpdateAttributes } from "atlasdb:types";

class AnaliseController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AnaliseService.find();
            
            res.status(200).json({
                success: true,
                message: 'Analises retornadas com sucesso',
                data
            });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {
                where: { id: Number(req.params.id) }
            }
            const data = await AnaliseService.findOne(where);
            res.status(200).json({
                success: true,
                message: 'Analise retornada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AnaliseCreationAttributes = {
                nome: req.body.nome,
                ativo: true
            };

            const data = await AnaliseService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Analise criada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AnaliseUpdateAttributes = {
                nome: req.body.nome,
                ativo: req.body.ativo
            };

            const data = await AnaliseService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Analise atualizada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);

            const data = await AnaliseService.toggle(id);

            res.status(200).json({
                success: true,
                message: 'Analise atualizada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AnaliseController();