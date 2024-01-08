import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces";
import { GrupoItemService, ItemService, ParticipacaoService } from "../services";
import { ParticipacaoItemCreationAttributes, ParticipacaoItemUpdateAttributes } from "atlasdb:types";
import { MarcaService, ModeloService } from "@api/modules/public/services";
import { ClienteService } from "@api/modules/cliente/services";

class ItemController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const itens = await ItemService.find();

            res.status(200).json({
                success: true,
                message: 'Items retornados com sucesso',
                data: itens
            });
        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const item = await ItemService.findOne({ where: { id: Number(req.params.id) } });

            res.status(200).json({
                success: true,
                message: 'Item retornado com sucesso',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }

    async findStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const status = await ItemService.findStatusDisponiveis();

            res.status(200).json({
                success: true,
                message: 'Status de item retornados com sucesso',
                data: status
            });
        } catch (error) {
            next(error);
        }
    }


    async findTaskByProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const participacao_id = Number(req.params.id);
    
            const tarefas = await ItemService.findTaskByProject(participacao_id);
            res.status(200).json({
                success: true,
                message: 'Tarefas por projeto retornadas com sucesso',
                data: tarefas
            })

        } catch (error) {
            next(error);
            console.log(error)
        }
    }

    async findItensConcorrentes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const item_id = Number(req.params.id);
    
            const tarefas = await ItemService.findItensConcorrentes(item_id);
            res.status(200).json({
                success: true,
                message: 'Tarefas por projeto retornadas com sucesso',
                data: tarefas
            })

        } catch (error) {
            next(error);
            console.log(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const participacao_id = Number(req.params.id);
            const payload: ParticipacaoItemCreationAttributes = req.body;

            const item = await ItemService.create(participacao_id, payload, req.user);
            
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
            const payload: ParticipacaoItemUpdateAttributes = req.body;

            const item = await ItemService.update(id, payload, req.user);
            
            res.status(200).json({
                success: true,
                message: 'Item atualizado com sucesso',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);

            const item = await ItemService.toggle(id);

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

export default new ItemController();