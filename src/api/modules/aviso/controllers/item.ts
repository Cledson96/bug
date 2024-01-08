import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces";
import { AvisoItemService } from "../services";
import { AvisoItemCreationAttributes, AvisoItemUpdateAttributes } from "atlasdb:types";

class AvisoItemController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const arquivos = await AvisoItemService.find();

            res.status(200).json({
                success: true,
                message: 'Items retornados com sucesso',
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
            const arquivo = await AvisoItemService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Item retornado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // const payload: AvisoItemCreationAttributes = {
            //     sequencial: 1,
            //     descricao: "Teste",
            //     relevante: true,
            //     aviso_id: 1,

            // };

            // const arquivo = await AvisoItemService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Item criado com sucesso',
                data: {}
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoItemUpdateAttributes = { relevante: req.body.relevante };

            const item = await AvisoItemService.update(id, payload);

            res.status(200).json({
                success: true,
                message: 'Item atualizado com sucesso',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AvisoItemController();