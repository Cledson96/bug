import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { RegraTipoService } from "@module/cliente/services";
import { RegraTipoCreationAttributes, RegraTipoUpdateAttributes } from "atlasdb:types";

class RegraTipoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const regraTipos = await RegraTipoService.find();

            res.status(200).json({
                success: true,
                message: 'Tipos de regra retornados com sucesso',
                data: regraTipos
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {

            }
            const regraTipo = await RegraTipoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Tipo de regra retornado com sucesso',
                data: regraTipo
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: RegraTipoCreationAttributes = {
                nome: req.body.nome,
                descricao: req.body.descricao,
                ativo: true
            };

            const regraTipo = await RegraTipoService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Novo tipo de regra criado com sucesso',
                data: regraTipo
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: RegraTipoUpdateAttributes = {
                nome: req.body.nome,
            };

            const regraTipos = await RegraTipoService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Tipo de regra atualizado com sucesso',
                data: regraTipos
            });
        } catch (error) {
            next(error);
        }
    }
    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const regraTipo = await RegraTipoService.toggle(id);

            res.status(200).json({
                success: true,
                message: 'Tipo de regra atualizada com sucesso',
                data: regraTipo
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new RegraTipoController();