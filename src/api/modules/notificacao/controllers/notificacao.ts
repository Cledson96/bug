import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { NotificacaoService } from "@module/notificacao/services";
import { NotificacaoCreationAttributes, NotificacaoUpdateAttributes } from "atlasdb:types";
import Socket from "@service/socket/index";

class NotificacaoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await NotificacaoService.find();

            res.status(200).json({
                success: true,
                message: 'Notificacoes retornadas com sucesso',
                data
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {}
            const data = await NotificacaoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Notificacao retornada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: NotificacaoCreationAttributes = {
                conteudo: req.body.conteudo,
                lida: req.body.lida,
                usuario_id: req.body.usuario_id,
                tipo_id: 1
            };

            const data = await NotificacaoService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Nova notificacao criada com sucesso',
                data
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: NotificacaoUpdateAttributes = {
                conteudo: req.body.conteudo,
                lida: req.body.lida,
                usuario_id: req.body.usuario_id
            };

            const data = await NotificacaoService.update(id, payload);

            res.status(200).json({
                success: true,
                message: 'Notificacao atualizada com sucesso',
                data
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}

export default new NotificacaoController();