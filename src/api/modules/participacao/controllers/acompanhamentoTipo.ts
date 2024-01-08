import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { ParticipacaoAcompanhamentoTipoService } from "../services";

class ParticipacaoAcompanhamentoTipoController implements IController{
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const movimentacoes = await ParticipacaoAcompanhamentoTipoService.find();
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
            const movimentacao = await ParticipacaoAcompanhamentoTipoService.findOne(where)

            res.status(200).json({
                success: true,
                message: 'Movimentação retornada com sucesso',
                data: movimentacao
            })
        } catch (error) {
            next(error)
        }
    }

    create(req: Request, res: Response, next: NextFunction): Promise<void> {
        throw new Error("Method not implemented.");
    }

    update(req: Request, res: Response, next: NextFunction): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default new ParticipacaoAcompanhamentoTipoController();