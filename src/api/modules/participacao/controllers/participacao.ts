import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { ItemService, ParticipacaoService } from "../services";
import { ParticipacaoItemCreationAttributes, ParticipacaoUpdateAttributes } from "atlasdb:types";

class ParticipacaoController implements IController {
    async getByScope(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projetos = await ParticipacaoService.getByScope(req.params.scope);
            res.status(200).json({
                success: true,
                message: `Projetos retornados com successo`,
                data: projetos
            })
        } catch (error) {
            next(error)
        }
    }
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const projetos = await ParticipacaoService.find();
            res.status(200).json({
                success: true,
                message: 'Projetos participação retornados com successo',
                data: projetos
            })
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {           
            const id = Number(req.params.id);
            const projetos = await ParticipacaoService.findOne(req.params.scope, {
                where: { id }
            });
            res.status(200).json({
                success: true,
                message: 'Projeto retornado com sucesso',
                data: projetos
            })
        } catch (error) {
            next(error)
        }
    }
    
    async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {           
            const id = Number(req.params.id);
            const status = await ParticipacaoService.getStatus(id);
            res.status(200).json({
                success: true,
                message: 'Status retornados com sucesso',
                data: status
            })
        } catch (error) {
            next(error)
        }
    }

    async getGruposItens(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {           
            const scope = req.params.scope
            const participacao_id = Number(req.params.id);
            const grupos = await ParticipacaoService.getGruposItens(scope, participacao_id);
            res.status(200).json({
                success: true,
                message: 'Grupos de itens retornados com sucesso',
                data: grupos
            })
        } catch (error) {
            next(error)
        }
    }

    async getItens(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {           
            const scope = req.params.scope
            const participacao_id = Number(req.params.id);
            const itens = await ParticipacaoService.getItens(scope, participacao_id);

            res.status(200).json({
                success: true,
                message: 'Itens retornados com sucesso',
                data: itens
            })
        } catch (error) {
            next(error)
        }
    }

    async createItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {           
            const participacao_id = Number(req.params.id);
            const payload: ParticipacaoItemCreationAttributes = req.body;

            const itens = await ItemService.create(participacao_id, payload, req.user!);
            
            res.status(200).json({
                success: true,
                message: 'Itens retornados com sucesso',
                data: itens
            })
        } catch (error) {
            next(error)
        }
    }

    create(req: Request, res: Response, next: NextFunction): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const id = Number(req.params.id)
            const scope = req.params.scope
            const payload: ParticipacaoUpdateAttributes = {
                ...req.body
            }

            const data = await ParticipacaoService.update(id, payload, req.user)
            
            res.status(200).json({
                success: true,
                message: 'Projeto atualizado com sucesso',
                data
            })

        } catch (error) {
            next(error)
        }

    }
    delete?(req: Request, res: Response, next: NextFunction): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async sendmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            console.log('Enviando email');

            const options = {
                from: 'brenno@teste.com',
                to: 'seila@teste.com.br',
            }

            const email = await ParticipacaoService.sendEmail(options);

            res.status(200).json({
                success: true,
                message: 'Email enviado com sucesso',
                data: email
            })

        } catch (error) {
            console.log(error)   
        }
    }
    
}

export default new ParticipacaoController();