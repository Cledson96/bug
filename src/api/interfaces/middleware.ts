import { Exception } from '@util/exceptions';
import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
    handle(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleException(error: Exception, req: Request, res: Response, next: NextFunction): void;
}