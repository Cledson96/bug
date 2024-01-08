import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { ParticipacaoArquivoService } from '@module/participacao/services'
import { ParticipacaoArquivoCreationAttributes, ParticipacaoArquivoUpdateAttributes } from "atlasdb:types";
class ParticipacaoArquivoController implements IController {

    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const ParticipacaoArquivos = await ParticipacaoArquivoService.find();

            res.status(200).json({
                success: true,
                message: 'Arquivos retornados com sucesso',
                data: ParticipacaoArquivos
            });
        } catch (error) {
            next(error)
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {}
            const ParticipacaoArquivo = await ParticipacaoArquivoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Arquivo retornado com sucesso',
                data: ParticipacaoArquivo
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const payload: ParticipacaoArquivoCreationAttributes = Object.assign(req.body);

            /* payload = {
                nome: req.body.nome,
                url_aws: req.body.url_aws,
                participacao_id: req.body.participacao_id,
                tipo_arquivo_id: req.body.tipo_arquivo_id,
                ativo: req.body.ativo,
            }
            */

            const ParticipacaoArquivo = await ParticipacaoArquivoService.create(payload);

            res.status(200).json({
                success: true,
                message: 'Arquivo enviado com sucesso',
                result: ParticipacaoArquivo
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const payload: ParticipacaoArquivoUpdateAttributes = {
                nome: req.body.nome,
                url_aws: req.body.url_aws,
                participacao_id: req.body.participacao_id,
                tipo_arquivo_id: req.body.tipo_arquivo_id,
                ativo: req.body.ativo,
            };

            // const ParticipacaoArquivo = await ParticipacaoArquivoService.update(id, payload);

            res.status(200).json({
                success: true,
                message: 'ParticipacaoArquivo atualizado com sucesso',
                // data: ParticipacaoArquivo
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new ParticipacaoArquivoController();