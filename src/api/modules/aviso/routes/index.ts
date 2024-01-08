import { Router } from "express"
import avisoRouter from "./aviso"
import avisoModalidadeRouter from "./modalidade"
import avisoTipoRouter from "./tipo"
import avisoRankingRouter from "./ranking"
import avisoMovimentacao from "./movimentacao"
import avisoStatusRouter from "./status"
import avisoEmailRouter from "./email"
import avisoAcompanhamentoTipoRouter from "./acompanhamentoTipo"
import avisoAcompanhamentoRouter from "./acompanhamento"
import avisoArquivosRouter from "./arquivo"
const router = Router()

router.use('/acompanhamentos/tipos', avisoAcompanhamentoTipoRouter)
router.use('/acompanhamentos', avisoAcompanhamentoRouter)
router.use('/movimentacao', avisoMovimentacao)
router.use('/modalidades', avisoModalidadeRouter)
router.use('/ranking', avisoRankingRouter)
router.use('/status', avisoStatusRouter)
router.use('/tipos', avisoTipoRouter)
router.use('/email', avisoEmailRouter)
router.use('/arquivos', avisoArquivosRouter)
router.use('/', avisoRouter)


export default router;