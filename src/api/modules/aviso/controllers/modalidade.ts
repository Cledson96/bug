import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AvisoModalidadeService } from "@module/aviso/services";
import { AvisoModalidadeCreationAttributes, AvisoModalidadeUpdateAttributes } from "atlasdb:types";

class AvisoModalidadeController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const modalidades = await AvisoModalidadeService.find();

            res.status(200).json({
                success: true,
                message: 'Modalidades de aviso retornadas com sucesso',
                data: modalidades
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
            const modalidade = await AvisoModalidadeService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Modalidade de aviso retornada com sucesso',
                data: modalidade
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AvisoModalidadeCreationAttributes = {
                nome: "Teste",
                tarefa_automatica: true
            };

            const aviso = await AvisoModalidadeService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Nova modalidade de aviso criada com sucesso',
                data: aviso
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoModalidadeUpdateAttributes = {
                nome: "Teste 2",
                tarefa_automatica: false
            };

            const modalidade = await AvisoModalidadeService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Modalidade de aviso atualizada com sucesso',
                data: modalidade
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AvisoModalidadeController();