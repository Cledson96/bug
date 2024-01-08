import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '@api/interfaces';
import { Exception } from '@util/exceptions';

export abstract class Middleware implements IMiddleware {
    abstract handle(req: Request, res: Response, next: NextFunction): Promise<void>;
    abstract handleException(error: Exception, req: Request, res: Response, next: NextFunction): void;
}