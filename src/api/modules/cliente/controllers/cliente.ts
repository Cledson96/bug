import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { ClienteService } from "@module/cliente/services";
import { ClienteCreationAttributes, ClienteUpdateAttributes } from "atlasdb:types";
import { Op } from "sequelize";

class ClienteController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clientes = await ClienteService.find({
                order: [['nome', 'ASC']]
            });

            res.status(200).json({
                success: true,
                message: 'Clientes retornados com sucesso',
                data: clientes
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {
                
            }
            const cliente = await ClienteService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Cliente retornado com sucesso',
                data: cliente
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: ClienteCreationAttributes = {
                cnpj: req.body.cnpj,
                nome: req.body.nome,
                email: req.body.email,
                grupo_id: req.body.grupo_id,
                municipio_id: req.body.municipio_id,
                ativo: true,
            };

            const cliente = await ClienteService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Novo cliente criado com sucesso',
                data: cliente
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: ClienteUpdateAttributes = {
                nome: req.body.nome,
                email: req.body.email,
                municipio_id: req.body.municipio_id,
                grupo_id: req.body.grupo_id,
            };

            const clientes = await ClienteService.update(id, payload);

            console.log(clientes);
            
            res.status(200).json({
                success: true,
                message: 'Cliente atualizado com sucesso',
                data: clientes
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);

            const cliente = await ClienteService.toggle(id);

            res.status(200).json({
                success: true,
                message: 'Cliente atualizado com sucesso',
                data: cliente
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ClienteController();