import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { RequisicoesService } from "@module/requisicoes/services";
import { RequisicoesAttributes, RequisicoesCreationAttributes, RequisicoesUpdateAttributes } from "atlasdb:types";


class RequisicoesController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const data = await RequisicoesService.find()

            res.status(200).json({
                success: true,
                message: 'Requisições retornadas com sucesso',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.body.id
            const data = await RequisicoesService.findOne(id)

            res.status(200).json({
                success: true,
                messasge: 'Requisição retornado com sucesso',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    async filterTable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const data = await RequisicoesService.filterTable(req.body.user, req.body.date_start, req.body.date_end)

            res.status(200).json({
                success: true,
                message: 'Requisições filtradas com sucesso',
                data
            })

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error,
                
            })
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: RequisicoesAttributes = {
                metodo: 'GET',
                momento: new Date(),
                status: 200,
                url: 'google.com',
                usuario_id: 1,
                ip: '192.168.1.126'
            }

            const data = await RequisicoesService.create(payload)

            res.status(200).json({
                success: true,
                message: 'Requisição criada com sucesso',
                data
            })
        } catch (error) {
            next(error)
        }
    }


    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

        } catch (error) {
            next(error)
        }
    }

}

export default new RequisicoesController()