import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { AvisoService } from "@module/aviso/services";
import { AvisoCreationAttributes, AvisoUpdateAttributes } from "atlasdb:types";

class AvisoController implements IController {

    async getByScope(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const avisos = await AvisoService.getByScope(req.params.scope);

            res.status(200).json({
                success: true,
                message: 'Avisos retornados com sucesso',
                data: avisos
            });

        } catch (error) {
            next(error);
        }
    }
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const avisos = await AvisoService.find();

            res.status(200).json({
                success: true,
                message: 'Avisos retornados com sucesso',
                data: avisos
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            
            const aviso = await AvisoService.findOne({
                where: { id }
            });

            res.status(200).json({
                success: true,
                message: 'Aviso retornados com sucesso',
                data: aviso
            });
        } catch (error) {
            next(error);
        }
    }
    
    async findEmails(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const id = Number(req.params.id)

            const emails = await AvisoService.findEmails(id)

            res.status(200).json({
                success: true,
                message: 'Emails retornados com sucesso!',
                data: emails
            })

        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AvisoCreationAttributes = {
                nome: "Teste",
                processo: "teste",
                objeto: "tste",
                unidade_id: 1,
                tipo_id: 1,
                modalidade_id: 1,
                data_atualizacao: new Date(),
                data_publicacao: new Date()
            };

            const aviso = await AvisoService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Aviso criado com sucesso',
                data: aviso
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const aviso_id = Number(req.params.id);
            const payload: AvisoUpdateAttributes = {
                nome: "TesteAtualizado",
                objeto: "tste",
            };

            const aviso = await AvisoService.update(aviso_id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Aviso criado com sucesso',
                data: aviso
            });
        } catch (error) {
            next(error);
        }
    }
    async pesquisaAnaliseIA(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id)
            
            await AvisoService.handlePesquisaIA(id);
            
            res.status(200).json({
                success: true, 
                message: 'Objetos do aviso analisado por IA recebidos'
            })
        } catch (error) {
            next(error);
        }
    }

    async preAnaliseIA(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id)

            await AvisoService.handlePreAnaliseIA(id);
            
            res.status(200).json({
                success: true, 
                message: 'Resposta da Pré-Analise IA recebida'
            })
        } catch (error) {
            next(error);
        }
    }
    async findItens(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(req.params.id)
            const itens = await AvisoService.findItens(id)

            res.status(200).json({
                success: true,
                message: "Itens retornados com sucesso",
                data: itens
            })
            
        } catch (error) {
            next(error)
        }
    }

}

export default new AvisoController();