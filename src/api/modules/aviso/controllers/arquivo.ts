import { IController } from "@api/interfaces";
import { Request, Response, NextFunction } from "express";
import { AvisoArquivoService } from "@module/aviso/services";
import {  AvisoArquivoCreationAttributes, AvisoArquivoUpdateAttributes, FileManagerAttributes } from "atlasdb:types";

class AvisoArquivoController implements IController {

    async getDirectory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const path = String(req.body.parentDir.path)
            const aviso_id = req.body.aviso_id

            const directory = await AvisoArquivoService.getDirectoryContents(path)
            
            res.status(200).json({
                success: true,
                message: 'Diretórios retornados com sucesso',
                data: directory
            })

        } catch (error) {
            next(error);
        }
    }

    async getFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const path = String(req.body.path)
            const directory = await AvisoArquivoService.getFile(path)

            res.status(200).json({
                success: true,
                message: 'Arquivo único retornado com sucesso',
                data: directory
            })
        } catch (error) {
            next(error)
        }
    }

    async moveFile(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const item = req.body.item
            const destinationDir = req.body.destinationDir

            const move = AvisoArquivoService.moveFile(item, destinationDir)

            res.status(200).json({
                success: true,
                message: 'Movido com sucesso',
                data: move
            })

        } catch (error) {
            next(error)            
        }
    }

    async copyFile(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const item = req.body.item
            const destinationDir = req.body.destinationDir

            const copy = AvisoArquivoService.copyFile( item, destinationDir)

            res.status(200).json({
                success: true,
                message: "Copiado com sucesso",
                data: copy
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const item = req.body.item
            const deleteF = AvisoArquivoService.deleteFile(item)

            res.status(200).json({
                success: true,
                message: 'Deletado com sucesso',
                data: deleteF
            })

        } catch (error) {
            next(error)
        }
    }

    async renameFile(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const file = req.body.item
            const newName = req.body.newName

            const rename = AvisoArquivoService.renameFile(file, newName)

            res.status(200).json({
                success: true,
                message: 'Arquivo renomeado com sucesso',
                data: rename
            })

        } catch (error) {
            next(error)
        }
    }

    async createDirectory(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const parentDir = req.body.parentDir
            const name = req.body.name

            const newDirectory = AvisoArquivoService.createDirectory(parentDir, name)

            res.status(200).json({
                success: true,
                message: "Diretório criado com sucesso",
                data: newDirectory
            })

        } catch (error) {
            next(error)
        }
    }

    async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.files) {
                throw new Error('No files uploaded');
            }
    
            const files = req.files;
            const destination = req.body.destinationDir;
    
            const upload = await AvisoArquivoService.uploadFiles(files as FileManagerAttributes, destination);
    
            res.status(200).json({
                success: true,
                message: 'Upload feito com sucesso',
                data: upload
            });
    
        } catch (error) {
            next(error);
        }
    }

    async filesPayloadExist(req: Request, res: Response, next: NextFunction): Promise<void>{
            if(!req.files || Object.keys(req.files).length === 0)
            res.status(400).json({
                success: true,
                error: "No files were uploaded",
            })
            next()
    } 

    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            res.status(200).json({
                success: true,
                message: 'Arquivos retornados com sucesso',
            });
        } catch (error) {
            next(error)
        }
    }
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const where = {

            }
            const arquivo = await AvisoArquivoService.findOne(where);

            res.status(200).json({
                success: true,
                message: 'Arquivo retornado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // const payload: AvisoArquivoCreationAttributes = {
            //     sequencial: 0,
            //     nome: "Teste",

            // };

            // const arquivo = await AvisoArquivoService.create(payload);
            
            res.status(200).json({
                success: true,
                message: 'Arquivo criado com sucesso',
                data: {}
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoArquivoUpdateAttributes = {
                sequencial: 0,
                nome: 'sdads'
            };

            const arquivo = await AvisoArquivoService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Arquivo atualizado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const payload: AvisoArquivoUpdateAttributes = {
                ativo: false
            };

            const arquivo = await AvisoArquivoService.update(id, payload);
            
            res.status(200).json({
                success: true,
                message: 'Arquivo inativado com sucesso',
                data: arquivo
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AvisoArquivoController();