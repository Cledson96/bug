import { Request, Response, NextFunction } from "express";
import { ParticipacaoStatusService } from "../services";
import { ParticipacaoStatusCreationAttributes } from "atlasdb:types";

class ParticipacaoStatusController{
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const status = await ParticipacaoStatusService.find();
            res.status(200).json({
                success: true,
                message: 'Status de participacao retornados com successo',
                data: status
            })
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {           
            const id = Number(req.params.id);
            const status = await ParticipacaoStatusService.findOne(id);
            res.status(200).json({
                success: true,
                message: 'Status de participacao retornado com sucesso',
                data: status
            })
        } catch (error) {
            next(error)
        }
    }
    async findAvailable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {           
            const status = await ParticipacaoStatusService.findAvailable(req.params.scope);
            res.status(200).json({
                success: true,
                message: 'Status de participacao retornado com sucesso',
                data: status
            })
        } catch (error) {
            next(error)
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {           
            const payload: ParticipacaoStatusCreationAttributes = req.body

            const status = await ParticipacaoStatusService.create(payload);
            res.status(200).json({
                success: true,
                message: 'Status de participacao criado com sucesso',
                data: status
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ParticipacaoStatusController();