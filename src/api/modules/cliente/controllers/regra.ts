import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { RegraService } from "@module/cliente/services";
import { RegraCreationAttributes, RegraUpdateAttributes } from "atlasdb:types";

class RegraController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const regras = await RegraService.find();

            res.status(200).json({
                success: true,
                message: 'Regras retornadas com sucesso',
                data: regras
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {

            }
            const regra = await RegraService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Regra retornada com sucesso',
                data: regra
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: RegraCreationAttributes = {
                // campo: req.body.campo,
                valor: req.body.valor,
                familia_id: req.body.familia_id,
                tipo_id: req.body.tipo_id,
                ativo: req.body.ativo ?? true,
            };

            const regra = await RegraService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Novo regra criada com sucesso',
                data: regra
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: RegraUpdateAttributes = {
                // campo: req.body.campo,
                valor: req.body.valor,
                tipo_id: req.body.tipo_id,
                ativo: req.body.ativo,
            };

            const regras = await RegraService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Regra atualizada com sucesso',
                data: regras
            });
        } catch (error) {
            next(error);
        }
    }
    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const regra = await RegraService.toggle(id);

            res.status(200).json({
                success: true,
                message: 'Regra atualizada com sucesso',
                data: regra
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new RegraController();