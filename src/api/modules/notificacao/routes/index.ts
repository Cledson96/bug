import { Router } from "express"
import notificacaoRouter from "./notificacao"

const router = Router()

router.use('/', notificacaoRouter)

export default router;