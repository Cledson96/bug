import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces";
import { AvisoMovimentacaoService } from "../services";
import { AvisoMovimentacaoCreationAttributes, AvisoMovimentacaoUpdateAttributes } from "atlasdb:types";

class AvisoMovimentacaoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id)

            const arquivos = await AvisoMovimentacaoService.find(id);

            res.status(200).json({
                success: true,
                message: 'Movimentacoes retornados com sucesso',
                data: arquivos
            });
        } catch (error) {
            next(error)
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AvisoMovimentacaoService.findAll(req.body.user, req.body.date_start, req.body.date_end)

            res.status(200).json({
                success: true,
                message: 'Movimentações retornados com sucesso',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const aviso_id = Number(req.params.id)
            const movimentacao_id = Number(req.params.movimentacao_id)
            
            const arquivo = await AvisoMovimentacaoService.findOne({
                where: { aviso_id, id: movimentacao_id }
            });

            res.status(200).json({
                success: true,
                message: 'Movimentacao retornado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AvisoMovimentacaoCreationAttributes = {
                justificativa: "Teste",
                complemento: "teste",
                data_inicio: new Date(),
                status_id: 1,
                aviso_id: 1,
                usuario_id: 1
            };

            const arquivo = await AvisoMovimentacaoService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Movimentacao criado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoMovimentacaoCreationAttributes = {
                data_inicio: new Date(),
                justificativa: 'teste update',
                status_id: Number(req.body.status_id),
                usuario_id: req.user?.id ?? 1
            };

            const arquivo = await AvisoMovimentacaoService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Movimentacao atualizado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
    // async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const id = Number(req.params.id);
    //         const payload: AvisoMovimentacaoStatusUpdateAttributes = {
    //             status_id: 2,
    //         };

    //         const arquivo = await AvisoMovimentacaoService.update(id, payload);
            
    //         res.status(200).json({
    //             success: true,
    //             message: 'Movimentacao desativada com sucesso',
    //             data: arquivo
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}

export default new AvisoMovimentacaoController();