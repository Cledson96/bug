import { Router } from "express"
import { TarefaGrupoController } from "../controllers"

const router = Router()

router.route('/')
    .get(TarefaGrupoController.find)
    .post(TarefaGrupoController.create)

router.route('/:id')
    .get(TarefaGrupoController.findOne)
    .put(TarefaGrupoController.update)
    .patch(TarefaGrupoController.find)

router.route('/:id/tipos')
    .get(TarefaGrupoController.find)
    
export default router;