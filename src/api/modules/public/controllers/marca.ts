import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { MarcaService, ModeloService } from "@module/public/services";
import { MarcaCreationAttributes, MarcaUpdateAttributes } from "atlasdb:types";

class MarcaController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const marca = await MarcaService.find();
            
            res.status(200).json({
                success: true,
                message: 'Marcas retornadas com sucesso',
                data: marca
            });
        } catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const where = {}
            const marca = await MarcaService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Marca retornada com sucesso',
                data: marca
            });
        } catch (error) {
            next(error);
        }
    }

    async findModelos(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const marcaId = Number(req.params.id);
            if(!marcaId) return;
            const modelos = await ModeloService.find({ where: { marca_id: marcaId } });

            res.status(200).json({
                success: true,
                message: 'Modelos retornados com sucesso',
                data: modelos
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const payload: MarcaCreationAttributes = {
                nome: req.body.nome,
                ativo: true,
            };

            const marca = await MarcaService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Marca criada com sucesso',
                data: marca
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void>{    
        try {
            const marcaId = Number(req.params.id);
            const payload: MarcaUpdateAttributes = {
                nome: req.body.nome,
            };
            
            const marca = await MarcaService.update(marcaId, payload);

            res.status(200).json({
                success: true,
                message: 'Marca atualizada com sucesso',
                data: marca
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new MarcaController();
