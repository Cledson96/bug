import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { SetorService } from "@module/public/services";
import { SetorAttributes, SetorUpdateAttributes } from "atlasdb:types";

class SetorController implements IController {

    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const setor = await SetorService.find();
            
            res.status(200).json({
                success: true,
                message: 'Setores retornados com sucesso',
                data: setor
            });
        } catch (error) {
            next(error);
        }
    }


    async findOne(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const where = {

            }
            const setor = await SetorService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Setor retornado com sucesso',
                data: setor
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const payload: SetorAttributes = {
                nome: req.body.nome,
                ativo: true,
                sigla: req.body.sigla,
            };

            const setor = await SetorService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Setor criado com sucesso',
                data: setor
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void>{    
        try {
            const setorId = Number(req.params.id);
            const payload: SetorUpdateAttributes = {
                nome: req.body.nome,
                sigla: req.body.sigla,
            };

            const setor = await SetorService.update(setorId, payload);

            res.status(200).json({
                success: true,
                message: 'Setor atualizado com sucesso',
                data: setor
            });
        } catch (error) {
            next(error);
        }
    }
   

}

export default new SetorController();
