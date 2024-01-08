import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { ModeloService } from "@module/public/services";
import { ModeloAttributes, ModeloUpdateAttributes } from "atlasdb:types";

class ModeloController implements IController{
    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const modelo = await ModeloService.find();

            res.status(200).json({
                success: true,
                message: 'Modelos retornados com sucesso',
                data: modelo
            });
        } catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const where = {

            }
            const modelo = await ModeloService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Modelo retornado com sucesso',
                data: modelo
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const payload: ModeloAttributes = {
                nome: req.body.nome,
                ativo: true,
                marca_id: req.body.marca,
            };

            const modelo = await ModeloService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Modelo criado com sucesso',
                data: modelo
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void>{    
        try {
            const modeloId = Number(req.params.id);
            const payload: ModeloUpdateAttributes = {
                nome: req.body.nome,
                marca_id: req.body.marca,
            };

            const modelo = await ModeloService.update(modeloId, payload);

            res.status(200).json({
                success: true,
                message: 'Modelo atualizado com sucesso',
                data: modelo
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ModeloController();