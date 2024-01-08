import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces";
import { ItemConcorrenteService } from "../services";
import { ParticipacaoItemConcorrenteCreationAttributes, ParticipacaoItemCreationAttributes, ParticipacaoItemUpdateAttributes } from "atlasdb:types";

class ItemConcorrenteController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const itens = await ItemConcorrenteService.find();

            res.status(200).json({
                success: true,
                message: 'Items de concorrentes retornados com sucesso',
                data: itens
            });
        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const item = await ItemConcorrenteService.findOne({ where: { id: Number(req.params.id) } });

            res.status(200).json({
                success: true,
                message: 'Item de concorrente retornado com sucesso',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: ParticipacaoItemConcorrenteCreationAttributes = req.body;

            const item = await ItemConcorrenteService.create(payload, req.user);
            
            res.status(200).json({
                success: true,
                message: 'Item criado com sucesso',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: ParticipacaoItemUpdateAttributes = {
                numero: 2,
                quantidade: 2,
                classificacao: 2,
                descricao: 'Item teste 02',
                valor_referencia: 42,
                valor_minimo: 30,
                valor_final: 60,
                valor_inicial: 32,
                valor_intervalo: 35,
                modelo_id: 2,
                grupo_item_id: 2,
            };

            const item = await ItemConcorrenteService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Item atualizado com sucesso',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new ItemConcorrenteController();