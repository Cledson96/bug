import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AvisoTipoService } from "@module/aviso/services";
import { AvisoTipoCreationAttributes, AvisoTipoUpdateAttributes } from "atlasdb:types";

class AvisoTipoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tipos = await AvisoTipoService.find();

            res.status(200).json({
                success: true,
                message: 'Tipos de aviso retornados com sucesso',
                data: tipos
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {
                id: Number(req.params.id)
            }
            const tipo = await AvisoTipoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Tipo de aviso retornado com sucesso',
                data: tipo
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AvisoTipoCreationAttributes = {
                nome: "Teste",
            };

            const aviso = await AvisoTipoService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Nova tipo de aviso criado com sucesso',
                data: aviso
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoTipoUpdateAttributes = {
                nome: "Teste 2",
            };

            const tipo = await AvisoTipoService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Tipo de aviso atualizado com sucesso',
                data: tipo
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new AvisoTipoController();