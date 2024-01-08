import { Request, Response, NextFunction } from "express";
import { IController } from "@api/interfaces/controller";
import { TipoService } from "@module/public/services";


class TipoController implements Omit<IController, "findOne" | "create" | "update"> {

    async find(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const setor = await TipoService.find();
            
            res.status(200).json({
                success: true,
                message: 'Tipos retornados com sucesso',
                data: setor
            });
        } catch (error) {
            next(error);
        }
    }



   

}

export default new TipoController();
