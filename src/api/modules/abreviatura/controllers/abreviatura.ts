import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AbreviaturaService } from "@module/abreviatura/services";
import { AbreviaturaCreationAttributes, AbreviaturaUpdateAttributes } from "atlasdb:types";
import { OrgaoData } from "abreviaturas";

class AbreviaturaController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AbreviaturaService.find();
            
            res.status(200).json({
                success: true,
                message: 'Abreviaturas retornadas com sucesso',
                data
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {
                where: { id: Number(req.params.id) }
            }
            const data = await AbreviaturaService.findOne(where);
            res.status(200).json({
                success: true,
                message: 'Abreviatura retornada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: AbreviaturaCreationAttributes = {
                sigla: req.body.sigla,
                nome: req.body.nome,
                palavra_forte: req.body.palavra_forte,
                incluir_cidade: req.body.incluir_cidade,
                secretaria: req.body.secretaria,
                militar: req.body.militar,
                ativo: true
            };

            const data = await AbreviaturaService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Abreviatura criada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AbreviaturaUpdateAttributes = {
                sigla: req.body.sigla,
                nome: req.body.nome,
                palavra_forte: req.body.palavra_forte,
                incluir_cidade: req.body.incluir_cidade,
                secretaria: req.body.secretaria,
                militar: req.body.militar,
                ativo: req.body.ativo
            };

            const data = await AbreviaturaService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Abreviatura atualizada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);

            const data = await AbreviaturaService.toggle(id);

            res.status(200).json({
                success: true,
                message: 'Abreviatura atualizado com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async abreviar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: OrgaoData = {
                orgao: req.body.orgao,
                unidade: req.body.unidade,
                cidade: req.body.cidade,
                uf: req.body.uf,
                dataEdital: req.body.dataEdital,
                modalidade: req.body.modalidade,
                processo: req.body.processo
            }

            const data = await AbreviaturaService.singleAbbreviation(payload)

            res.status(200).json({
                success: true,
                message: 'Abreviatura realizada com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
    async multiAbreviar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const payload: OrgaoData[] = req.body.orgaos;

            const data = await AbreviaturaService.multiAbbreviation(payload)

            res.status(200).json({
                success: true,
                message: 'Abreviaturas realizadas com sucesso',
                data
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AbreviaturaController();