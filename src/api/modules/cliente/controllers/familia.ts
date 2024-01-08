import { Request, Response, NextFunction } from 'express';
import { IController } from '@api/interfaces';
import { FamiliaService, RegraService, TagService } from '../services';
import { Op } from 'sequelize';
import { FamiliaCreationAttributes } from 'atlasdb:types';

class FamiliaController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const familia = await FamiliaService.find({
                order: [['nome', 'ASC']]
            });

            res.status(200).json({
                success: true,
                data: familia
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const familia = await FamiliaService.findOne(res.locals.id);

            res.status(200).json({
                success: true,
                data: familia
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async findByGroupClient(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = Number(req.params.id)
            const familiaByGroup = await FamiliaService.findByGroupClient(id)

            res.status(200).json({
                success: true,
                message: 'Familia por Grupo retornado com sucesso',
                data: [familiaByGroup]
            })

        } catch (error) {
            next(error)
        }
    }

    async findTags(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tags = await TagService.find({ where: { familia_id: Number(req.params.id) } });

            res.status(200).json({
                success: true,
                message: 'tags retornadas com sucesso',
                data: tags
            });
        } catch (error) {
            next(error);
        }
    }

    async findRegras(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const regras = await RegraService.find({ where: { familia_id: Number(req.params.id) } });

            res.status(200).json({
                success: true,
                message: 'regras retornadas com sucesso',
                data: regras
            });
        } catch (error) {
            next(error);
        }
    }


    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: FamiliaCreationAttributes = {
                nome: req.body.nome,
                cliente_grupo_id: req.body.cliente_grupo_id,
                ativo: req.body.ativo ?? true,
                // tags: req.body.tags,
                // regras: req.body.regras
            }

            const familia = await FamiliaService.create(payload);

            res.status(200).json({
                success: true,
                data: familia,
                message: 'Familia criada com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {          
            const id = Number(req.params.id);
            const familia = await FamiliaService.update(id, req.body);

            res.status(200).json({
                success: true,
                data: familia,
                message: 'Familia atualizada com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const familia = await FamiliaService.toggle(id);

            res.status(200).json({
                success: true,
                message: 'Familia atualizada com sucesso',
                data: familia
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new FamiliaController();