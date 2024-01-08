import { Request, Response, NextFunction  } from 'express'
import { IController } from "@api/interfaces";
import { AlteracoesServices } from "../services";
import { AlteracoesAttributes, AlteracoesCreationAttributes, AlteracoesUpdateAttributes } from 'atlas-orm/build/schemas/interfaces';

class AlteracoesController implements IController{

    async find(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const data = await AlteracoesServices.find()
            res.status(200).json({
                success: true,
                message: 'Alterações retornadas com sucesso',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    async filterTable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AlteracoesServices.filterTable(req.body.user, req.body.date_start, req.body.date_end)

            res.status(200).json({
                success: true,
                message: 'Alterações retornadas com sucesso',
                data
            })

        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.body.id
            const data = await AlteracoesServices.findOne(id)

            res.status(200).json({
                success: true,
                messasge: 'Alteração retornada com sucesso',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AlteracoesAttributes = {
                entidade_id: 1,
                novo: '',
                velho: '',
                tabela: '',
                usuario_id: 1,
                tipo: ''
            }

            const data = await AlteracoesServices.create(payload)

            res.status(200).json({
                success: true,
                message: 'Alteração criada com sucesso',
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

export default new AlteracoesController()