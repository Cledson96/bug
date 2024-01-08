import { Request, Response, NextFunction } from 'express';
import { IController } from '@api/interfaces';
import { UsuarioCreationAttributes, UsuarioUpdateAttributes } from 'atlasdb:types';
import { AuthService } from '../services';
import format from '@util/format';

class AuthController {
    async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { nick, senha } = req.body;

            
            const token = await AuthService.authenticateUser(nick, senha);

            res.status(200).json({ success: true, message: 'Usuário autenticado com sucesso!', data: format(token) });
        } 
        catch (error) {
            next(error);
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const usuario = await AuthService.getUser(req);

            res.status(200).json({ success: true, message: 'Usuário encontrado!', data: usuario });
        } 
        catch (error) {
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const usuario = await AuthService.changePassword(req);

            res.status(200).json({ success: true, message: 'Senha alterada com sucesso!', data: usuario });
        } 
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { email } = req.body;
            
            const result = await AuthService.resetPassword(email);

            res.status(200).json({ success: true, message: 'Código enviado com sucesso!', data: result });
        } 
        catch (error) {
            next(error);
        }
    }
    async newPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { email , codigo , senha } = req.body;
            
            const result = await AuthService.newPassword(email , codigo , senha);

            res.status(200).json({ success: true, message: 'Senha alterada com sucesso!', data: result });
        } 
        catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
