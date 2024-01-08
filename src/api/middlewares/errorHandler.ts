import { Exception } from '@util/exceptions';
import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../classes/Middleware';
import Logger from '@util/logger';

class ErrorHandler extends Middleware {
    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        next();
    }

    handleException(error: Exception, req: Request, res: Response, next: NextFunction): void {
        const status = error.status || 202;
        const message = error.message || 'Erro interno do servidor';

        Logger.error(message);

        res.status(status).json({ success: false, message: message });
    }
}

export default new ErrorHandler();