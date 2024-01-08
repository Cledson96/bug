import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { ClienteService, FamiliaService, ClienteGrupoService } from "@module/cliente/services";
import { ClienteGrupoCreationAttributes, ClienteGrupoUpdateAttributes } from "atlasdb:types";

class ClienteGrupoController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const grupos = await ClienteGrupoService.find({
                order: [['nome', 'ASC']]
            });

            res.status(200).json({
                success: true,
                message: 'Grupos de cliente retornados com sucesso',
                data: grupos
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {

            }
            const grupo = await ClienteGrupoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Grupo de cliente retornado com sucesso',
                data: grupo
            });
        } catch (error) {
            next(error);
        }
    }
    async findClientes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clientes = await ClienteService.find({ where: { grupo_id: Number(req.params.id) } });

            res.status(200).json({
                success: true,
                message: 'Clientes retornados com sucesso',
                data: clientes
            });
        } catch (error) {
            next(error);
        }
    }
    async findFamilias(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const familias = await FamiliaService.find({ where: { cliente_grupo_id: Number(req.params.id) } });

            res.status(200).json({
                success: true,
                message: 'Familias retornadas com sucesso',
                data: familias
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: ClienteGrupoCreationAttributes = {
                nome: req.body.nome,
                email: req.body.email,
                interno: req.body.interno,
                ativo: true,
            };

            const ClienteGrupo = await ClienteGrupoService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Grupo de cliente criado com sucesso',
                data: ClienteGrupo
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: ClienteGrupoUpdateAttributes = {
                nome: req.body.nome,
                email: req.body.email,
                interno: req.body.interno,
                ativo: req.body.ativo,
            };

            const grupo = await ClienteGrupoService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Grupo de cliente atualizado com sucesso',
                data: grupo
            });
        } catch (error) {
            next(error);
        }
    }
    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const grupo = await ClienteGrupoService.toggle(id);

            res.status(200).json({
                success: true,
                message: 'Grupo de cliente atualizado com sucesso',
                data: grupo
            });
        } catch (error) {
            next(error);
        }
    }

    async findByAviso(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const byAviso = await ClienteGrupoService.findByAviso(Number(req.params.id))

            res.status(200).json({
                success: true,
                message: 'Grupos por Aviso retornados com sucesso',
                data: byAviso
            })

        } catch (error) {
            next(error)
        }
    }
}

export default new ClienteGrupoController();