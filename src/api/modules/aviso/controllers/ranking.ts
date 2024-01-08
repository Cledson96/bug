import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AvisoRankingService } from "@module/aviso/services";
import { AvisoRankingCreationAttributes, AvisoRankingUpdateAttributes } from "atlasdb:types";

class AvisoRankingController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const AvisoRankings = await AvisoRankingService.find();

            res.status(200).json({
                success: true,
                message: 'Tags retornadas com sucesso',
                data: AvisoRankings
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {}
            const AvisoRanking = await AvisoRankingService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Tags retornada com sucesso',
                data: AvisoRanking
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const payload: number[] = req.body.tag_id
            const avisoId = req.body.aviso_id

            const aviso = await AvisoRankingService.create(avisoId, payload);
            
            res.status(200).json({
                success: true,
                message: 'Nova tag criada com sucesso',
                data: aviso
            });

        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoRankingUpdateAttributes = {
                // ranking: req.body.ranking,
            };

            const AvisoRanking = await AvisoRankingService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Tag atualizada com sucesso',
                data: AvisoRanking
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AvisoRankingController();