import { Request, Response, NextFunction } from 'express';
import { IController } from '@api/interfaces';
import { UsuarioService } from '@module/usuario/services';
import { UsuarioCreationAttributes, UsuarioUpdateAttributes } from 'atlasdb:types';

class UsuarioController implements IController {
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const usuarios = await UsuarioService.find();
            res.status(200).json({ success: true, message: 'Usuarios retornados com sucesso!', data: usuarios });
        } 
        catch (error) {
            next(error);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const usuario = await UsuarioService.findById(id);
            
            res.status(200).json({ success: true, data: usuario });
        } 
        catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    
 
        try {
            const payload: UsuarioCreationAttributes = {
                ...req.body
            }

            const verifyEmail = await UsuarioService.findOne({ where: { email: payload.email } });
            const verifyNick = await UsuarioService.findOne({ where: { nick: payload.nick } });
 

            if(verifyEmail) throw new Error('Email já cadastrado!');
            
            if(verifyNick) throw new Error('Nick já cadastrado!');

            const usuario = await UsuarioService.create(payload);

            res.status(201).json({
                success: true,
                data: usuario,
                message: 'Usuario criado com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id)

            const payload: UsuarioUpdateAttributes = {
                ...req.body
            }
            
            const verifyEmail = await UsuarioService.findOne({ where: { email: payload.email } });
            const verifyNick = await UsuarioService.findOne({ where: { nick: payload.nick } });

            if(verifyEmail && verifyEmail.id !== id) throw new Error('Email já cadastrado!');
            if(verifyNick && verifyNick.id !== id) throw new Error('Nick já cadastrado!');

            const usuario = await UsuarioService.update(id, payload);
    
            res.status(200).json({
                success: true,
                data: usuario,
                message: 'Usuario atualizado com sucesso!'
            });
        } 
        catch (error) {
            next(error);
        }
    }

    // async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         throw new Error('Method not implemented.');
    //     } 
    //     catch (error) {
    //         next(error);
    //     }
    // }
}

export default new UsuarioController();
