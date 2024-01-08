import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AvisoAcompanhamentoService } from "@module/aviso/services";
import { AvisoAcompanhamentoCreationAttributes, AvisoAcompanhamentoUpdateAttributes } from "atlasdb:types";

class AvisoAcompanhamentoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const acompanhamentos = await AvisoAcompanhamentoService.find();

            res.status(200).json({
                success: true,
                message: 'Acompanhamentos retornados com sucesso',
                data: acompanhamentos
            });
        } catch (error) {
            next(error)
        }
    }

    async findAcompanhamentos(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = Number(req.params.id)

            const acompanhamentos = await AvisoAcompanhamentoService.findAcompanhamentos(id)

            res.status(200).json({
                success: true,
                message: 'Acompanhamentos por aviso retornados com sucesso!',
                data: acompanhamentos
            })

        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const aviso_id = Number(req.params.id);

            const where = { where: { id: aviso_id } }
            const acompanhamento = await AvisoAcompanhamentoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Acompanhamento retornado com sucesso',
                data: acompanhamento
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AvisoAcompanhamentoCreationAttributes = {
                comentario: req.body.comentario,
                sucesso: req.body.sucesso,
                aviso_id: req.body.aviso_id,
                usuario_id: req.body.usuario_id,
                tipo_id: req.body.tipo_id
            };

            const acompanhamento = await AvisoAcompanhamentoService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Acompanhamento criado com sucesso',
                data: acompanhamento
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoAcompanhamentoUpdateAttributes = {
                comentario: "Teste atualizacao",
                sucesso: true,
            };

            const acompanhamento = await AvisoAcompanhamentoService.update(id, payload);

            res.status(200).json({
                success: true,
                message: 'Acompanhamento atualizado com sucesso',
                data: acompanhamento
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AvisoAcompanhamentoController();