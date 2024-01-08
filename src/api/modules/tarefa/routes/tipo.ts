import { Router } from "express"
import { TarefaTipoController } from "../controllers"

const router = Router()

router.route('/')
    .get(TarefaTipoController.find)
    .post(TarefaTipoController.create)

router.route('/:id')
    .get(TarefaTipoController.findOne)
    .put(TarefaTipoController.update)
    .patch(TarefaTipoController.update)   

export default router;