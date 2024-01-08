import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { ParticipacaoAcompanhamentoService } from "../services";
import { ParticipacaoAcompanhamentoCreationAttributes } from "atlasdb:types";

class ParticipacaoAcompanhamentoController implements IController{
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.query.participacao_id);
            const movimentacoes = await ParticipacaoAcompanhamentoService.find(id);
            res.status(200).json({
                success: true,
                message: 'Movimentações retornadas com successo',
                data: movimentacoes
            })
        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const where = { where: { id } }
            const movimentacao = await ParticipacaoAcompanhamentoService.findOne(where)

            res.status(200).json({
                success: true,
                message: 'Movimentação retornada com sucesso',
                data: movimentacao
            })
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: ParticipacaoAcompanhamentoCreationAttributes = {
                comentario: req.body.comentario,
                ativo: req.body.ativo,
                tipo_id: req.body.tipo_id,
                participacao_id: req.body.participacao_id,
                usuario_id: req.body.usuario_id
            }

            const comentario = await ParticipacaoAcompanhamentoService.create(payload);
            
            res.json({
                success: true,
                message: 'Comentário criado com sucesso',
                data: comentario
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
        
    }

    update(req: Request, res: Response, next: NextFunction): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default new ParticipacaoAcompanhamentoController();