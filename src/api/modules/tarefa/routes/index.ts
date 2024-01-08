import { Router } from 'express'
import tarefaRouter from "./tarefa"
import tarefaGrupoRouter from "./grupo"
import TarefaMovimentacaoRouter from "./movimentacao"
import TarefaStatusRouter from "./status"
import TarefaTipoRouter from "./tipo"

const router = Router();

router.use('/status', TarefaStatusRouter)
router.use('/movimentacoes', TarefaMovimentacaoRouter)
router.use('/tipos', TarefaTipoRouter)
router.use('/grupos', tarefaGrupoRouter)
router.use('/', tarefaRouter)

export default router;