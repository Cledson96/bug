import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { ParticipacaoMovimentacaoService } from "../services";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";


class ParticipacaoMovimentacaoController{

    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const data = await ParticipacaoMovimentacaoService.find(req.body.user, req.body.date_start, req.body.date_end)

            res.status(200).json({
                success: true,
                message: 'Movimentacoes retornadas com sucesso',
                data
            })

        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await ParticipacaoMovimentacaoService.findOne(req.body.id)

            res.status(200).json({
                success: true,
                message: 'Movimentacao retornada com sucesso',
                data
            })

        } catch (error) {
            next(error)
        }   
    }


}

export default new ParticipacaoMovimentacaoController()