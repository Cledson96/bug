import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces";
import { AvisoStatusService } from "../services";
import { AvisoStatusCreationAttributes, AvisoStatusUpdateAttributes } from "atlasdb:types";

class AvisoStatusController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const arquivos = await AvisoStatusService.find();

            res.status(200).json({
                success: true,
                message: 'Statuss retornados com sucesso',
                data: arquivos
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {

            }
            const arquivo = await AvisoStatusService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Status retornado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AvisoStatusCreationAttributes = {
                // nome: "Teste",
                // descricao: "Teste desc"
                ...req.body
            };

            const arquivo = await AvisoStatusService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Status criado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoStatusUpdateAttributes = {
                nome: "Teste Atualização",
                descricao: "Teste desc atualizado",
                justificativa: true,
            };

            const arquivo = await AvisoStatusService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Status atualizado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AvisoStatusController();