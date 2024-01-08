import { Router } from "express"
import grupoItemRouter from "./grupoItens"
import itemConcorrenteRouter from "./itemConcorrente"
import comentarioRouter from "./acompanhamento"
import tipoComentarioRouter from "./tipoAcompanhamento"
import participacaoRoutes from "./participacao"
import participacaoStatusRoutes from "./status"
import participacaoEmailRoutes from "./email"
import participacaoEmailTemplatesRoutes from "./email"
import itemRouter from "./item"
import arquivoRoutes from "./arquivo"

const router = Router()

router.use('/grupos-itens', grupoItemRouter)
router.use('/itens', itemRouter)
router.use('/itens-concorrentes', itemConcorrenteRouter)
router.use('/tipos-comentarios', tipoComentarioRouter)
router.use('/comentarios', comentarioRouter)
router.use('/status', participacaoStatusRoutes)
router.use('/templates', participacaoEmailTemplatesRoutes)
router.use('/email', participacaoEmailRoutes)
router.use('/arquivos', arquivoRoutes)
router.use('/', participacaoRoutes)

export default router;