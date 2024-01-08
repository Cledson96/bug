import { Router } from "express"
import { TarefaController } from "@api/modules/tarefa/controllers";

const router = Router();

router.route('/')
    .get(TarefaController.find)
    .post(TarefaController.create)

router.route('/:id')
    .get(TarefaController.findOne)
    .put(TarefaController.update)
    .patch(TarefaController.update)

router.route('/:id/movimentacoes')
    .put(TarefaController.update)

export default router;