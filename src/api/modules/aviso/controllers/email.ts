import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AvisoEmailServices } from '@module/aviso/services'
import { AvisoEmailCreationAttributes, AvisoEmailUpdateAttributes } from "atlasdb:types";
class AvisoEmailController implements IController {

    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const ParticipacaoEmails = await AvisoEmailServices.find();

            res.status(200).json({
                success: true,
                message: 'Emails retornados com sucesso',
                data: ParticipacaoEmails
            });
        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {}
            const ParticipacaoEmail = await AvisoEmailServices.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Email retornado com sucesso',
                data: ParticipacaoEmail
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const payload: AvisoEmailCreationAttributes = {
                assunto: req.body.assunto,
                cc: req.body.cc,
                cco: req.body.cc,
                replyTo: req.body.replyTo,
                mensagem: req.body.mensagem,
                data_envio: req.body.data_envio,
                agendado: req.body.agendado,
                tipo_id: req.body.tipo_id,
                aviso_id: req.body.id,
                usuario_id: req.body.usuario_id,
            };

            const ParticipacaoEmail = await AvisoEmailServices.create(payload);

            res.status(200).json({
                success: true,
                message: 'Email enviado com sucesso',
                data: ParticipacaoEmail
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const payload: AvisoEmailUpdateAttributes = {
                assunto: req.body.assunto,
                cc: req.body.cc,
                cco: req.body.cco,
                replyTo: req.body.replyTo,
                mensagem: req.body.mensagem,
                data_envio: req.body.data_envio,
                agendado: req.body.agendado,
                tipo_id: req.body.tipo_id,
                aviso_id: req.body.id,
                usuario_id: req.body.usuario_id,
            };

            // const ParticipacaoEmail = await AvisoEmailServices.update(id, payload);

            res.status(200).json({
                success: true,
                message: 'ParticipacaoEmail atualizado com sucesso',
                // data: ParticipacaoEmail
            });
        } catch (error) {
            next(error);
        }
    }

    async getTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const scope = String(req.body.scope)
            
            const aviso_id = Number(req.body.id)

            const template = await AvisoEmailServices.getTemplate(scope, aviso_id);

            res.status(200).json({
                success: true,
                message: 'Template retornado com sucesso',
                data: template
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    

}

export default new AvisoEmailController();