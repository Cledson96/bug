import { Request, Response, NextFunction } from "express";
import { GrupoItemService, ParticipacaoService } from "../services";
import { ParticipacaoGrupoItemCreationAttributes, ParticipacaoGrupoItemUpdateAttributes } from "atlasdb:types";
import { IController } from "@api/interfaces";

class GrupoItemController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const data = await ParticipacaoService.getParticipacaoItens(id);

            res.status(200).json({
                success: true,
                message: 'Grupos de items retornados com sucesso',
                data
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {

            }
            const arquivo = await GrupoItemService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Item retornado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }

    async findItensConcorrentes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const grupo_item_id = Number(req.params.id);

            const itens_concorrentes = await GrupoItemService.findItensConcorrentes(grupo_item_id);

            res.status(200).json({
                success: true,
                message: 'Itens concorrentes deste grupo retornados com sucesso',
                data: itens_concorrentes
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const participacaoId = Number(req.params.id);
            const payload: ParticipacaoGrupoItemCreationAttributes = Object.assign(req.body);

            const item = await GrupoItemService.create(participacaoId, payload);
            
            res.status(200).json({
                success: true,
                message: 'Grupo, marca, modelo e item criados com sucesso',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: ParticipacaoGrupoItemUpdateAttributes = {
                numero: 2,
                classificacao: 2,
                descricao: 'Grupo de produtos teste editado',
                participacao_id: 2
            };

            const arquivo = await GrupoItemService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Item atualizado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new GrupoItemController();