import { Router } from 'express'
import requisicoesRouter from "./requisicoes"

const router = Router();

router.use('/', requisicoesRouter)

export default router;
