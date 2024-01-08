import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { TagService } from "@module/cliente/services";
import { TagCreationAttributes, TagUpdateAttributes } from "atlasdb:types";
import { Op } from "sequelize";

class TagController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tags = await TagService.find({
                order: [['nome', 'ASC']]
            });

            res.status(200).json({
                success: true,
                message: 'Tags retornadas com sucesso',
                data: tags
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {

            }
            const tag = await TagService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Tags retornada com sucesso',
                data: tag
            });
        } catch (error) {
            next(error);
        }
    }

    async findTagByFamily(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            
            const tagByFamily = await TagService.findTagByFamily(Number(req.params.id))

            res.status(200).json({
                success: true,
                message: 'Tags por familia retornado com sucesso',
                data: tagByFamily
            })

        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: TagCreationAttributes = {
                nome: req.body.nome,
                familia_id: req.body.familia_id,
                ativo: req.body.ativo ?? true,
                tipo_id: req.body.tipo_id
            };

            const aviso = await TagService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Nova tag criada com sucesso',
                data: aviso
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: TagUpdateAttributes = {
                nome: req.body.nome,
                // familia_id: req.body.familia_id,
                ativo: req.body.ativo,
            };

            const tag = await TagService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Tag atualizada com sucesso',
                data: tag
            });
        } catch (error) {
            next(error);
        }
    }
    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const tag = await TagService.toggle(id);

            res.status(200).json({
                success: true,
                message: 'Tag atualizada com sucesso',
                data: tag
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new TagController();