import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { AuthService } from "@api/modules/autenticacao/services";

class verifyToken {
    async isUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers['authorization'];
        
        if (!token || token === null || token === undefined) {
            res.status(401).json({ message: 'Token de Autorização não informado' });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ message: 'Erro de autorização' });
            return;
        }
        
        try {
            const decoded = jwt.verify(token, secret);

            if (typeof decoded === 'string') {
                res.status(401).json({ message: 'Erro no token de autorização' });
                return;
            }

            const user = await AuthService.getUser(req);
            

            if (!user) {
                res.status(401).json({ message: 'Usuário não encontrado' });
                return;
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Usuario não autorizado' });
        }
    }

    isAdmin(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers['authorization'];
        if (!token) {
            res.status(401).json({ message: 'Token de Autorização não informado' });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ message: 'Erro de autorização' });
            return;
        }

        try {
            const decoded = jwt.verify(token, secret);

            if (typeof decoded === 'string') {
                res.status(401).json({ message: 'Erro no token de autorização' });
                return;
            }
            
            if (decoded.nick != 'MSS') {
                res.status(401).json({ message: 'Usuário não autorizado' });
                return;
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Usuario não autorizado' });
        }
    }
}

export default new verifyToken();
