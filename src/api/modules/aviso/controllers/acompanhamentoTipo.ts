import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AvisoAcompanhamentoTipoService } from "@module/aviso/services";
import { AvisoAcompanhamentoTipoCreationAttributes, AvisoAcompanhamentoTipoUpdateAttributes } from "atlasdb:types";

class AvisoAcompanhamentoTipoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const acompanhamentotipos = await AvisoAcompanhamentoTipoService.find();
            
            res.status(200).json({
                success: true,
                message: 'Tipos de acompanhamento retornados com sucesso',
                data: acompanhamentotipos
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {}
            const acompanhamentotipo = await AvisoAcompanhamentoTipoService.findOne(where);
            res.status(200).json({
                success: true,
                message: 'Tipo de acompanhamento retornado com sucesso',
                data: acompanhamentotipo
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AvisoAcompanhamentoTipoCreationAttributes = {
                nome: "Teste",
                descricao: "Teste desc"
            };

            const acompanhamentotipo = await AvisoAcompanhamentoTipoService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Tipo de acompanhamento criado com sucesso',
                data: acompanhamentotipo
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoAcompanhamentoTipoUpdateAttributes = {
                nome: "Teste atualizado",
                descricao: "Teste desc atualizado",
            };

            const acompanhamentotipo = await AvisoAcompanhamentoTipoService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Tipo de acompanhamento atualizado com sucesso',
                data: acompanhamentotipo
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AvisoAcompanhamentoTipoController();