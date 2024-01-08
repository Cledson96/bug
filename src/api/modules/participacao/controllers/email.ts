import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { ParticipacaoEmailService } from '@module/participacao/services'
import { ParticipacaoEmailCreationAttributes, ParticipacaoEmailUpdateAttributes } from "atlasdb:types";
class ParticipacaoEmailController implements IController {

    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const ParticipacaoEmails = await ParticipacaoEmailService.find();

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
            const ParticipacaoEmail = await ParticipacaoEmailService.findOne(where);

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
            
            const payload: ParticipacaoEmailCreationAttributes = {
                assunto: req.body.assunto,
                cc: req.body.cc,
                cco: req.body.cc,
                replyTo: req.body.replyTo,
                mensagem: req.body.mensagem,
                data_envio: req.body.data_envio,
                agendado: req.body.agendado,
                tipo_id: req.body.tipo_id,
                participacao_id: req.body.id,
                usuario_id: req.body.usuario_id,
            };

            const ParticipacaoEmail = await ParticipacaoEmailService.create(payload);

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
            const payload: ParticipacaoEmailUpdateAttributes = {
                assunto: req.body.assunto,
                cc: req.body.cc,
                cco: req.body.cco,
                replyTo: req.body.replyTo,
                mensagem: req.body.mensagem,
                data_envio: req.body.data_envio,
                agendado: req.body.agendado,
                tipo_id: req.body.tipo_id,
                participacao_id: req.body.id,
                usuario_id: req.body.usuario_id,
            };

            // const ParticipacaoEmail = await ParticipacaoEmailService.update(id, payload);

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
            
            const participacao_id = Number(req.body.id)

            const template = await ParticipacaoEmailService.getTemplate(scope, participacao_id);

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

export default new ParticipacaoEmailController();