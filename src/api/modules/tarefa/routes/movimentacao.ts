import { Router } from "express"
import { TarefaMovimentacaoController } from "../controllers"

const router = Router()

router.route('/')
    .get(TarefaMovimentacaoController.find)
    .post(TarefaMovimentacaoController.findMov)

router.route('/:id')
    .get(TarefaMovimentacaoController.findOne)
    .put(TarefaMovimentacaoController.update)

export default router;
